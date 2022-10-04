import Phaser from "phaser";
import {lerp, noise, random, randomInRange} from "../math";
import {HexColor} from "../scenes/colors";

function point(x: number, y: number): Point {
    return {x, y}
}

function many(n: number, f: (i: number) => any) {
    return [...Array(n)].map((_, i: number) => f(i));
}

type Point = {
    x: number,
    y: number,
}

type Circle = {
    x: number,
    y: number,
    len: number,
    radius: number,
}

type Velocity = {
    horizontal: number,
    vertical: number
}

export class Spider extends Phaser.GameObjects.Graphics {
    private circles: Circle[];
    private points: Point[];
    private seed: number;
    private targetX: number;
    private targetY: number;
    private kx: number;
    private ky: number;
    private walkRadius: Point;
    private r: number;
    private graphics: Phaser.GameObjects.Graphics;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private velocity: Velocity;

    SPIDER_SPEED = 10;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.graphics = this.scene.add.graphics({
            fillStyle: {color: HexColor.white},
            lineStyle: {width: 0.5, color: HexColor.white, alpha: 1.0}
        })
        this.velocity = {horizontal: 0, vertical: 0}

        this.circles = many(1000, () => {
            return {
                x: randomInRange(-innerWidth, innerWidth),
                y: randomInRange(-innerHeight, innerHeight),
                len: 0,
                radius: 0
            };
        });
        // TODO: the points don't go out of (0, 0) -> decenter the playing area in some way or generate then points over a larger distance, possibly in a dynamic way
        // const debugGraphics = this.scene.add.graphics({fillStyle: { color: HexColor.white }, lineStyle: {width: 0.5, color: HexColor.white, alpha: 1.0}})
        // this.circles
        //     .map(circle => ({...circle, radius : 2 }))
        //     .forEach(circle => debugGraphics.fillCircle(circle.x, circle.y, circle.radius))

        this.points = many(9, (idx) => point(
            Math.cos((idx / 9) * Math.PI * 2),
            Math.sin((idx / 9) * Math.PI * 2)
        ))

        const maxRadius = 150
        this.seed = random(100)
        this.targetX = random(innerWidth);
        this.targetY = random(innerHeight);
        this.x = 0
        this.y = 0
        this.kx = random(0.5, 0.5)
        this.ky = random(0.5, 0.5)
        this.walkRadius = point(random(maxRadius, maxRadius), random(maxRadius, maxRadius))
        this.r = innerWidth / random(100, 150);
    }

    update(_time: number, _delta: number) {
        this.graphics.clear()
        this.getUserInputs()
        this.tick(_time / 1000)
    }

    paintCircle(circle: Circle) {
        this.points.forEach((pt2) => {
            if (!circle.len)
                return
            this.drawLine(
                lerp(this.x + pt2.x * this.r, circle.x, circle.len * circle.len),
                lerp(this.y + pt2.y * this.r, circle.y, circle.len * circle.len),
                this.x + pt2.x * this.r,
                this.y + pt2.y * this.r
            );
        });
        this.drawCircle(circle);
    }

    tick(time: number) {
        if (this.velocity.horizontal !== 0) this.targetX = this.targetX + this.velocity.horizontal
        if (this.velocity.vertical !== 0) this.targetY = this.targetY + this.velocity.vertical

        const selfMoveX = Math.cos(time * this.kx + this.seed) * this.walkRadius.x
        const selfMoveY = Math.sin(time * this.ky + this.seed) * this.walkRadius.y
        const fx = this.targetX + selfMoveX;
        const fy = this.targetY + selfMoveY;


        this.x += Math.min(innerWidth / 100, (fx - this.x) / 10)
        this.y += Math.min(innerWidth / 100, (fy - this.y) / 10)

        let i = 0
        this.circles.forEach((circle) => {
            const distanceFromCircleToSpider = Math.hypot(circle.x - this.x, circle.y - this.y);
            let newCircleRadius = Math.min(2, innerWidth / distanceFromCircleToSpider / 5);
            const isIncreasing = distanceFromCircleToSpider < innerWidth / 10
                && (i++) < 8;
            const direction = isIncreasing ? 0.1 : -0.1;
            if (isIncreasing) {
                newCircleRadius *= 1.5;
            }
            circle.radius = newCircleRadius;
            circle.len = Math.max(0, Math.min(circle.len + direction, 1));
            this.paintCircle(circle)
        });
    }

    drawCircle(circle: Circle) {
        this.graphics.fillCircle(circle.x, circle.y, circle.radius)
    }

    drawLine(x0: number, y0: number, x1: number, y1: number) {
        this.graphics.beginPath()
        this.graphics.moveTo(x0, y0)
        const n = 100;
        many(n, (i) => {
            i = (i + 1) / n;
            const x = lerp(x0, x1, i);
            const y = lerp(y0, y1, i);
            const k = noise(x / 5 + x0, y / 5 + y0) * 2;
            this.graphics.lineTo(x + k, y + k);
        });
        this.graphics.closePath()
        this.graphics.stroke()
    }

    private getUserInputs() {
        if (this.cursors.left.isDown) {
            this.velocity.horizontal = -this.SPIDER_SPEED
        } else if (this.cursors.right.isDown) {
            this.velocity.horizontal = this.SPIDER_SPEED
        } else {
            this.velocity.horizontal = 0
        }

        if (this.cursors.up.isDown) {
            this.velocity.vertical = -this.SPIDER_SPEED
        } else if (this.cursors.down.isDown) {
            this.velocity.vertical = this.SPIDER_SPEED
        } else {
            this.velocity.vertical = 0
        }
    }
}

import Phaser from "phaser";
import {lerp, noise, random, randomInRange} from "../math";
import {HexColor} from "../colors";
import {Circle, point, Point, Velocity} from "../physics";

function many(n: number, f: (i: number) => any) {
    return [...Array(n)].map((_, i: number) => f(i));
}

export class Spider extends Phaser.GameObjects.Graphics {
    private circles: Circle[];
    private points: Point[];
    private readonly seed: number;
    private targetX: number;
    private targetY: number;
    private readonly verticalAcceleration: number;
    private readonly horizontalAcceleration: number;
    private walkRadius: Point;
    private readonly bodyRadius: number;
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

        // TODO: huge room for performance improvement here
        // TODO: we don't need to render more points than necessary for surrounding the spider
        this.circles = many(2000, () => {
            return {
                x: randomInRange(-innerWidth * 2, innerWidth * 2),
                y: randomInRange(-innerHeight * 2, innerHeight * 2),
                len: 0,
                radius: 0,
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
        this.seed = random(100) // Can be used to differentiate movement patterns if there are multiple spiders
        this.x = 0
        this.y = 0
        this.targetX = this.x
        this.targetY = this.y
        this.verticalAcceleration = random(0.5, 0.5)
        this.horizontalAcceleration = random(0.5, 0.5)
        this.walkRadius = point(random(maxRadius, maxRadius), random(maxRadius, maxRadius))
        this.bodyRadius = 2
    }

    update(time: number, _delta: number) {
        this.tick(time / 1000)
    }

    paintCircle(circle: Circle) {
        if (circle.len > 0){
            this.points.forEach((point) => {
                this.drawLine(
                    lerp(this.x + point.x * this.bodyRadius, circle.x, circle.len * circle.len),
                    lerp(this.y + point.y * this.bodyRadius, circle.y, circle.len * circle.len),
                    this.x + point.x * this.bodyRadius,
                    this.y + point.y * this.bodyRadius
                );
            });
        }
        this.drawCircle(circle);
    }

    tick(time: number) {
        this.getUserInputs()

        if (this.velocity.horizontal !== 0) this.targetX = this.targetX + this.velocity.horizontal
        if (this.velocity.vertical !== 0) this.targetY = this.targetY + this.velocity.vertical

        const selfMoveX = Math.cos(time * this.verticalAcceleration + this.seed) * this.walkRadius.x
        const selfMoveY = Math.sin(time * this.horizontalAcceleration + this.seed) * this.walkRadius.y
        const fx = this.targetX + selfMoveX;
        const fy = this.targetY + selfMoveY;

        this.x += Math.min(innerWidth / 100, (fx - this.x) / 10)
        this.y += Math.min(innerWidth / 100, (fy - this.y) / 10)

        this.draw()
    }

    draw(){
        this.graphics.clear()

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

    private drawCircle(circle: Circle) {
        this.graphics.fillCircle(circle.x, circle.y, circle.radius)
    }

    private drawLine(x0: number, y0: number, x1: number, y1: number) {
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

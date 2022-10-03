import Phaser from "phaser";
import {HexColor} from "../scenes/colors";

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

export class Spider extends Phaser.GameObjects.Graphics {
    private circles: Circle[];
    private points: Point[];
    private seed: number;
    private tx: number;
    private ty: number;
    private kx: number;
    private ky: number;
    private walkRadius: Point;
    private r: number;
    private graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene) {
        super(scene);

        this.graphics = this.scene.add.graphics({fillStyle: { color: HexColor.white }, lineStyle: {width: 0.5, color: HexColor.white, alpha: 1.0}})


        // TODO: the points don't go out of (0, 0) -> decenter the playing area in some way or generate then points over a larger distance
        // const debugGraphics = this.scene.add.graphics({fillStyle: { color: HexColor.white }, lineStyle: {width: 0.5, color: HexColor.white, alpha: 1.0}})
        // const circle = {
        //     x: 0,
        //     y: 0,
        //     len: 0,
        //     radius: 10
        // }
        // debugGraphics.fillCircle(circle.x, circle.y, circle.radius)

        this.circles = many(1000, () => {
            return {
                x: randomInRange(-innerWidth, innerWidth),
                y: randomInRange(-innerHeight, innerHeight),
                len: 0,
                radius: 0
            };
        });
        this.circles.forEach(circle => this.drawCircle(circle))

        this.points = many(9, (idx) => point(
            Math.cos((idx / 9) * Math.PI * 2),
            Math.sin((idx / 9) * Math.PI * 2)
        ))

        const maxRadius = 150
        this.seed = random(100)
        this.tx = random(innerWidth);
        this.ty = random(innerHeight);
        this.x = 0
        this.y = 0
        this.kx = random(0.5, 0.5)
        this.ky = random(0.5, 0.5)
        this.walkRadius = point(random(maxRadius, maxRadius), random(maxRadius, maxRadius))
        this.r = innerWidth / random(100, 150);
    }

    update(_time: number, _delta: number) {
        this.graphics.clear()
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
        const selfMoveX = Math.cos(time * this.kx + this.seed) * this.walkRadius.x
        const selfMoveY = Math.sin(time * this.ky + this.seed) * this.walkRadius.y
        const fx = this.tx + selfMoveX;
        const fy = this.ty + selfMoveY;

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

    drawCircle(circle : Circle) {
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
}

function random(scale = 1, offset = 0) {
    return Math.random() * scale + offset;
}

function randomInRange(a: number, b: number) {
    return Math.random() * (b - a) + a;
}

function many(n: number, f: (i: number) => any) {
    return [...Array(n)].map((_, i: number) => f(i));
}

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

function noise(x: number, y: number, t = 101) {
    const w0 = Math.sin(0.3 * x + 1.4 * t + 2.0 +
        2.5 * Math.sin(0.4 * y + -1.3 * t + 1.0));
    const w1 = Math.sin(0.2 * y + 1.5 * t + 2.8 +
        2.3 * Math.sin(0.5 * x + -1.2 * t + 0.5));
    return w0 + w1;
}

function point(x: number, y: number): Point {
    return {x, y}
}

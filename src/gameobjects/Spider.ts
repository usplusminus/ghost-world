import Phaser from "phaser";
import {hexColors} from "../scenes/colors";

type Point = {
    x: number,
    y: number,
    len?: number,
    r?: number,
    t?: number
}

export class Spider extends Phaser.GameObjects.Graphics {
    private points: Point[];
    private points2: Point[];
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

        this.graphics = this.scene.add.graphics({lineStyle: {width: 3, color: hexColors.black, alpha: 0.6}})

        this.points = many(100, () => {
            return {
                x: randomInRange(innerWidth),
                y: randomInRange(innerHeight),
                len: 0,
                r: 0
            };
        });

        this.points2 = many(9, (idx) => {
            return {
                x: Math.cos((idx / 9) * Math.PI * 2),
                y: Math.sin((idx / 9) * Math.PI * 2)
            };
        });

        this.seed = randomInRange(100)
        this.tx = randomInRange(innerWidth);
        this.ty = randomInRange(innerHeight);
        this.x = randomInRange(innerWidth)
        this.y = randomInRange(innerHeight)
        this.kx = randomInRange(0.5, 0.5)
        this.ky = randomInRange(0.5, 0.5)
        this.walkRadius = point(randomInRange(50, 50), randomInRange(50, 50))
        this.r = innerWidth / randomInRange(100, 150);
    }

    override update(_time: number, _delta: number) {
        this.graphics.clear()
        this.tick(_time / 100)
    }

    paintPoint(point: Point) {
        this.points2.forEach((pt2) => {
            if (!point.len)
                return
            this.drawLine(
                lerp(this.x + pt2.x * this.r, point.x, point.len * point.len),
                lerp(this.y + pt2.y * this.r, point.y, point.len * point.len),
                this.x + pt2.x * this.r,
                this.y + pt2.y * this.r
            );
        });
        this.drawCircle(point.x, point.y, point.r!);
    }

    tick(time: number) {
        const selfMoveX = Math.cos(time * this.kx + this.seed) * this.walkRadius.x
        const selfMoveY = Math.sin(time * this.ky + this.seed) * this.walkRadius.y
        const fx = this.tx + selfMoveX;
        const fy = this.ty + selfMoveY;

        this.x += Math.min(innerWidth / 100, (fx - this.x) / 10)
        this.y += Math.min(innerWidth / 100, (fy - this.y) / 10)

        let i = 0
        this.points.forEach((point) => {
            const distanceFromPointToSpider = Math.hypot(point.x - this.x, point.y - this.y);
            let newPointRadius = Math.min(2, innerWidth / distanceFromPointToSpider / 5);
            point.t = 0;
            const isIncreasing = distanceFromPointToSpider < innerWidth / 10
                && (i++) < 8;
            const direction = isIncreasing ? 0.1 : -0.1;
            if (isIncreasing) {
                newPointRadius *= 1.5;
            }
            point.r = newPointRadius;
            point.len = Math.max(0, Math.min(point.len! + direction, 1));
            this.paintPoint(point)
        });
    }


    drawCircle(x: number, y: number, r: number) {
        this.graphics.fillCircle(x, y, r)
    }

    drawLine(x0: number, y0: number, x1: number, y1: number) {
        const path = new Phaser.Curves.Path(x0, y0);
        const n = 100;
        many(n, (i) => {
            i = (i + 1) / n;
            const x = lerp(x0, x1, i);
            const y = lerp(y0, y1, i);
            const k = noise(x / 5 + x0, y / 5 + y0) * 2;
            path.lineTo(x + k, y + k);
        });
        path.draw(this.graphics)
    }
}

function randomInRange(max = 1, offset = 0) {
    return Math.random() * max + offset;
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

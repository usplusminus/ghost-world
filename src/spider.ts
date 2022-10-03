import {colors} from "./scenes/colors";

let w: number, h: number;
let ctx: CanvasRenderingContext2D;

export function startSpiders(canvas: HTMLCanvasElement) {
    ctx = canvas.getContext("2d")!;
    // const spiders = many(2, spawn)
    const spiders = [spawn()]

    addEventListener("mousemove", (e) => {
        spiders.forEach(spider => {
            spider.follow(e.clientX, e.clientY)
        })
    });

    requestAnimationFrame(function anim(t) {
        if (w !== innerWidth) w = canvas.width = innerWidth;
        if (h !== innerHeight) h = canvas.height = innerHeight;
        ctx.fillStyle = colors.white;
        drawCircle(0, 0, w * 10);
        ctx.fillStyle = ctx.strokeStyle = colors.white;
        t/=1000
        spiders.forEach(spider => spider.tick(t))
        requestAnimationFrame(anim);
    });
}

type Point = {
    x: number,
    y: number,
    len?: number,
    r?: number,
    t?: number
}

function spawn() {

    const points: Point[] = many(100, () => {
        return {
            x: randomInRange(innerWidth),
            y: randomInRange(innerHeight),
            len: 0,
            r: 0
        };
    });

    const points2: Point[] = many(9, (idx) => {
        return {
            x: Math.cos((idx / 9) * Math.PI * 2),
            y: Math.sin((idx / 9) * Math.PI * 2)
        };
    });

    let seed = randomInRange(100)
    let tx = randomInRange(innerWidth);
    let ty = randomInRange(innerHeight);
    let x = randomInRange(innerWidth)
    let y = randomInRange(innerHeight)
    let kx = randomInRange(0.5, 0.5)
    let ky = randomInRange(0.5, 0.5)
    let walkRadius = point(randomInRange(50,50), randomInRange(50,50))
    let r = innerWidth / randomInRange(100, 150);

    function paintPoint(pt: Point){
        points2.forEach((pt2) => {
            if (!pt.len )
                return
            drawLine(
                lerp(x + pt2.x * r, pt.x, pt.len * pt.len),
                lerp(y + pt2.y * r, pt.y, pt.len * pt.len),
                x + pt2.x * r,
                y + pt2.y * r
            );
        });
        drawCircle(pt.x, pt.y, pt.r!);
    }

    return {
        follow(x: number, y: number) {
            tx = x;
            ty = y;
        },

        tick(time: number) {

            const selfMoveX = Math.cos(time * kx + seed) * walkRadius.x
            const selfMoveY = Math.sin(time * ky + seed) * walkRadius.y
            const fx = tx + selfMoveX;
            const fy = ty + selfMoveY;

            x += Math.min(innerWidth/100, (fx - x)/10)
            y += Math.min(innerWidth/100, (fy - y)/10)

            let i = 0
            points.forEach((point) => {
                const distanceFromPointToSpider = Math.hypot(point.x - x, point.y - y);
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
                paintPoint(point)
            });
        }
    }
}

function drawCircle(x: number, y: number, r: number) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawLine(x0: number, y0: number, x1: number, y1: number) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);

    const n = 100
    many(n, (i) => {
        i = (i + 1) / n;
        let x = lerp(x0, x1, i);
        let y = lerp(y0, y1, i);
        let k = noise(x/5+x0, y/5+y0) * 2;
        ctx.lineTo(x + k, y + k);
    });

    ctx.stroke();
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
    return { x, y}
}

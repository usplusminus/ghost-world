import Phaser from "phaser";
import {lerp, noise, random, randomInRange} from "../math";
import {HexColor} from "../colors";
import {point, Point, Velocity} from "../physics";
import {eventEmitter, GameEvent} from "../events";

function many(n: number, f: (i: number) => any) {
    return [...Array(n)].map((_, i: number) => f(i));
}

export type SpiderAnchors = {
    x: number,
    y: number,
    len: number,
    radius: number,
}

export class Spider extends Phaser.GameObjects.Graphics {
    private circles: SpiderAnchors[];
    private points: Point[];
    private readonly seed: number;
    private targetX: number;
    private targetY: number;
    private readonly verticalAcceleration: number;
    private readonly horizontalAcceleration: number;
    private walkRadius: Point;
    private readonly bodyRadius: number;
    lineGraphics: Phaser.GameObjects.Graphics;
    pointGraphics: Phaser.GameObjects.Graphics;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private velocity: Velocity;

    SPIDER_SPEED = 10;
    MAX_RADIUS = 2;
    NUMBER_OF_LEGS = 9;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.create()
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

    create() {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.lineGraphics = this.scene.add.graphics({
            fillStyle: {color: HexColor.white},
            lineStyle: {width: 0.5, color: HexColor.white, alpha: 1.0}
        })
        this.pointGraphics = this.scene.add.graphics({
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

        this.points = many(this.NUMBER_OF_LEGS, (idx) => point(
            Math.cos((idx / this.NUMBER_OF_LEGS) * Math.PI * 2),
            Math.sin((idx / this.NUMBER_OF_LEGS) * Math.PI * 2)
        ))


    }

    update(time: number, _delta: number) {
        this.tick(time / 1000)
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


        eventEmitter.emit(GameEvent.SPIDER_POSITION_UPDATED, this.x, this.y)

        this.lineGraphics.clear()
        this.pointGraphics.clear()
        this.draw()
    }

    draw(drawPoints = true){
        let i = 0
        this.circles.forEach((circle) => {
            const distanceFromCircleToSpider = Phaser.Math.Distance.Between(circle.x, circle.y, this.x, this.y);
            const newCircleRadius = Math.min(this.MAX_RADIUS, innerWidth / distanceFromCircleToSpider / 5);
            const isIncreasing = distanceFromCircleToSpider < innerWidth / 10 && (i++) < (this.NUMBER_OF_LEGS - 1);
            const direction = isIncreasing ? 0.1 : -0.1;
            isIncreasing
                ? circle.radius = newCircleRadius * 1.5
                : circle.radius = newCircleRadius;
            circle.len = Math.max(0, Math.min(circle.len + direction, 1));
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
            if (drawPoints && circle.radius > 0.5)
                this.drawCircle(circle);
        })
    }

    private drawCircle(circle: SpiderAnchors) {
        this.pointGraphics.fillCircle(circle.x, circle.y, circle.radius)
    }

    private drawLine(x0: number, y0: number, x1: number, y1: number) {
        this.lineGraphics.beginPath()
        this.lineGraphics.moveTo(x0, y0)
        const n = 100;
        many(n, (i) => {
            i = (i + 1) / n;
            const x = lerp(x0, x1, i);
            const y = lerp(y0, y1, i);
            const k = noise(x / 5 + x0, y / 5 + y0) * 2;
            this.lineGraphics.lineTo(x + k, y + k);
        });
        this.lineGraphics.closePath()
        this.lineGraphics.stroke()
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

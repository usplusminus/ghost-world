import Phaser from "phaser";
import {HexColor} from "../colors";
import {eventEmitter, GameEvent, sendTextToScreen1} from "../events";
import {sampleList} from "../math";

const texts = [
    "I've always wanted to start a choir with my friends",
    "ABC",
    "CDF",
    "JHKJHKJ"
]

export default class Interactable extends Phaser.GameObjects.Graphics {
    private readonly graphics: Phaser.GameObjects.Graphics;
    private readonly position: Phaser.Math.Vector2;
    private readonly radius: number;

    constructor(
        scene: Phaser.Scene,
        position: Phaser.Math.Vector2,
        radius: number,
    ) {
        super(scene);
        this.position = position
        this.radius = radius
        this.graphics = this.scene.add.graphics({
            fillStyle: {color: HexColor.white},
            lineStyle: {width: 0.5, color: HexColor.white, alpha: 1.0}
        })
        this.graphics.fillCircle(this.position.x, this.position.y, this.radius)

        eventEmitter.on(GameEvent.SPIDER_POSITION_UPDATED, (x: number, y: number) => {
            if (this.position.distance({ x, y }) < this.radius)
                this.broadcastInteraction()
        })
    }

    broadcastInteraction() {
        sendTextToScreen1(sampleList(texts))
    }
}

import Phaser from "phaser";
import {HexColor} from "../colors";
import {eventEmitter, GameEvent, triggerEvent} from "../events";

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
        triggerEvent(GameEvent.INTERACTABLE)
        eventEmitter.emit(GameEvent.INTERACTABLE)
    }
}

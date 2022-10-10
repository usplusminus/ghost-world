import Phaser from "phaser";
import {eventEmitter, GameEvent, SceneTrigger, sendTextToScreen1, sendTriggerToScreen2} from "../events";
import {sampleList} from "../math";
import assets from "../assets";

const texts = [
    "I've always wanted to start a choir with my friends",
    "ABC",
    "CDF",
    "JHKJHKJ"
]

export default class Interactable extends Phaser.GameObjects.Graphics {
    private readonly position: Phaser.Math.Vector2;
    private readonly radius: number;
    private lastInteraction: number;
    private spiderHasBeenOutsideOfRadiusSinceLastInteraction: boolean;

    constructor(
        scene: Phaser.Scene,
        position: Phaser.Math.Vector2,
        radius: number,
    ) {
        super(scene);
        this.position = position
        this.radius = radius
        this.scene.add.image(this.position.x, this.position.y, assets.images.star.key).setScale(0.2, 0.2)
        const requiredIntervalMs = 500
        this.lastInteraction = Date.now() - requiredIntervalMs

        eventEmitter.on(GameEvent.SPIDER_POSITION_UPDATED, (x: number, y: number) => {
            if (!(this.position.distance({ x, y }) < this.radius)){
                this.spiderHasBeenOutsideOfRadiusSinceLastInteraction = true
                return
            }
            if (!this.spiderHasBeenOutsideOfRadiusSinceLastInteraction) return
            if (Date.now() - this.lastInteraction < requiredIntervalMs) return
            this.broadcastInteraction()
        })
    }

    broadcastInteraction() {
        this.lastInteraction = Date.now()
        this.spiderHasBeenOutsideOfRadiusSinceLastInteraction = false
        sendTextToScreen1(sampleList(texts))
        sendTriggerToScreen2(SceneTrigger.DINNER_SCENE)
    }
}

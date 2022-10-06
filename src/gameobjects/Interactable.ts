import Phaser from "phaser";
import {HexColor} from "../scenes/colors";


export default class Interactable extends Phaser.GameObjects.Graphics {
    private readonly graphics: Phaser.GameObjects.Graphics;
    private readonly position: Phaser.Math.Vector2;
    private readonly radius: number;
    private readonly observableObjects: Phaser.GameObjects.Graphics[];

    constructor(
        scene: Phaser.Scene,
        position: Phaser.Math.Vector2,
        radius: number,
        observableObjects: Phaser.GameObjects.Graphics[]
    ) {
        super(scene);
        this.position = position
        this.radius = radius
        this.graphics = this.scene.add.graphics({
            fillStyle: {color: HexColor.white},
            lineStyle: {width: 0.5, color: HexColor.white, alpha: 1.0}
        })
        this.observableObjects = observableObjects
    }

    update(){
        this.graphics.fillCircle(this.position.x, this.position.y, this.radius)
        this.observableObjects.forEach(graphics => {
            if (this.position.distance({ x : graphics.x, y: graphics.y }) < this.radius)
                this.emitInteractedWith(graphics)
        })
    }

    emitInteractedWith(graphics: Phaser.GameObjects.Graphics) {
        console.log(`Interacted with graphics with distance ${this.position.distance({x : graphics.x, y: graphics.y}).toFixed(0)}`)
    }
}

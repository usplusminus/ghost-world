import Phaser from 'phaser';
import {Spider} from "../gameobjects/Spider";


const MIRROR_SCENE = "MirrorScene"

export default class MirrorScene extends Phaser.Scene {
    private primarySpider: Spider;
    private mirroredSpider: Spider;
    private debugText: Phaser.GameObjects.Text;

    constructor() {
        super(MIRROR_SCENE);
    }

    create() {
        this.cameras.main.setZoom(0.5);
        this.primarySpider = new Spider(this)
        this.mirroredSpider = new Spider(this)
        this.cameras.main.centerOn(this.primarySpider.x, this.primarySpider.y);
        const lerpingFactor = 0.2
        this.cameras.main.startFollow(this.primarySpider, true, lerpingFactor, lerpingFactor);
        this.debugText = this.add.text(50, 50, "I am your mirror", { fontSize: "32px"})
    }

    update(time: number, _delta: number) {
        this.primarySpider.update(time, _delta)
        this.mirroredSpider.x = this.primarySpider.x
        this.mirroredSpider.y = this.primarySpider.y - 500
        this.mirroredSpider.draw()
        this.debugText.setPosition(this.mirroredSpider.x - 100, this.mirroredSpider.y - 250)
    }
}

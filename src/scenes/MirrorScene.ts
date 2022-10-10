import Phaser from 'phaser';
import {Spider} from "../gameobjects/Spider";
import {HexColor} from "../colors";
import {LOCAL_STORAGE_EVENT} from "../events";

export const MIRROR_SCENE = "MirrorScene"

export default class MirrorScene extends Phaser.Scene {
    private primarySpider: Spider;
    private mirroredSpider: Spider;
    private debugText: Phaser.GameObjects.Text;
    private mirrorFrame: Phaser.Geom.Rectangle;
    private mirrorGraphics: Phaser.GameObjects.Graphics;

    constructor() {
        super(MIRROR_SCENE);
    }

    create() {
        this.primarySpider = new Spider(this)
        this.mirroredSpider = new Spider(this)
        this.cameras.main.centerOn(this.primarySpider.x, this.primarySpider.y);
        const lerpingFactor = 0.2
        this.cameras.main.startFollow(this.primarySpider, true, lerpingFactor, lerpingFactor);
        this.debugText = this.add.text(50, 50, "I am your mirror", { fontSize: "32px"})
        this.mirrorFrame = new Phaser.Geom.Rectangle(
            300,
            -600,
            300,
            450
        )
        this.mirrorGraphics = this.add.graphics({
            fillStyle: {color: HexColor.black, alpha: 1.0},
            lineStyle: {width: 3.0, color: HexColor.white, alpha: 1.0}
        })
        this.mirrorGraphics.strokeRectShape(this.mirrorFrame)

        addEventListener(LOCAL_STORAGE_EVENT, (e: StorageEvent) => {
            console.log("MirrorScene logging the storage")
            console.log(e)
        })
    }

    update(time: number, _delta: number) {
        this.primarySpider.update(time, _delta)

        this.mirroredSpider.x = this.primarySpider.x
        this.mirroredSpider.y = this.primarySpider.y - 500
        this.mirroredSpider.lineGraphics.clear()
        this.mirroredSpider.pointGraphics.clear()

        const spiderIsInsideRectangle = this.mirrorFrame.contains(this.mirroredSpider.x, this.mirroredSpider.y)
        if (spiderIsInsideRectangle){
            this.mirroredSpider.draw(false)
        }

        this.debugText.setPosition(this.mirroredSpider.x - 100, this.mirroredSpider.y - 250)
    }

}

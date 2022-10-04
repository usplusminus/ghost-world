import Phaser from 'phaser';
import assets from "../assets";
import {Spider} from "../gameobjects/Spider";
import {semanticColors} from "./colors";

export default class MainScene extends Phaser.Scene {
    private spider: Spider;
    private textPath: Phaser.GameObjects.Text[];

    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.audio(assets.sounds.notification.key, assets.sounds.notification.filepath);
    }

    create() {
        this.cameras.main.setZoom(0.5);

        this.spider = new Spider(this)
        this.cameras.main.centerOn(this.spider.x, this.spider.y);

        const lerpingFactor = 0.2
        this.cameras.main.startFollow(this.spider, true, lerpingFactor, lerpingFactor);

        const points = [
            20, 550,
            260, 450,
            300, 250,
            550, 145,
            745, 256
        ].map(v => v * 3)
        const path = new Phaser.Curves.Spline(points)
        const storyText = "What if you could trace the lineage of ideas from person to person throughout history"
        this.textPath = path
            .getSpacedPoints(storyText.length)
            .map((point, idx, allSpacedPoints) => {
                const rotation = idx === 0 ? 0 : point.cross(allSpacedPoints[idx - 1])
                return this.add.text(point.x, point.y, storyText.at(idx) ?? "",
                    {fontSize: '32px', color: semanticColors.primary, fontFamily: "Times New Roman"}
                ).setRotation(rotation)
            }
            )
    }

    update(_time: number, _delta: number) {
        this.spider.update(_time, _delta)
        this.textPath.forEach(ch => ch.setRotation(ch.rotation + (Math.random() > 0.5 ? .01 : -.01)))
    }
}

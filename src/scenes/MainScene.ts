import Phaser from 'phaser';
import assets from "../assets";
import {Spider} from "../gameobjects/Spider";
import {semanticColors} from "./colors";
import {debugGraphicsConfig, whiteStrokeGraphicsConfig} from "../gameobjects/graphics";
import Vector2 = Phaser.Math.Vector2;

export default class MainScene extends Phaser.Scene {
    private spider: Spider;
    private textPath: Phaser.GameObjects.Text[];
    private debugGraphics: Phaser.GameObjects.Graphics;
    private whiteStrokeGraphics: Phaser.GameObjects.Graphics;

    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.audio(assets.sounds.notification.key, assets.sounds.notification.filepath);
    }

    create() {
        this.debugGraphics = this.add.graphics(debugGraphicsConfig)
        this.whiteStrokeGraphics = this.add.graphics(whiteStrokeGraphicsConfig)
        this.cameras.main.setZoom(0.5);
        this.spider = new Spider(this)
        this.cameras.main.centerOn(this.spider.x, this.spider.y);
        const lerpingFactor = 0.2
        this.cameras.main.startFollow(this.spider, true, lerpingFactor, lerpingFactor);
        this.setupTextPaths()
    }

    setupTextPaths(){
        const dinnerPathPoints = [
            new Vector2(-20, -550),
            new Vector2(-300, -600),
            new Vector2(-500, -800),
            new Vector2(-1700, -700),
            new Vector2(-2200, -1000),
        ]
        dinnerPathPoints.forEach(point => this.debugGraphics.fillCircle(point.x, point.y, 10))
        const dinnerPath = new Phaser.Curves.Spline(dinnerPathPoints)
        dinnerPath.draw(this.whiteStrokeGraphics)


        const points = [
            new Vector2(20, 550),
            new Vector2(260, 450),
            new Vector2(300, 250),
            new Vector2(550, 145),
            new Vector2(745, 256)
        ].map(v => v.scale(3))
        points.forEach(point => this.debugGraphics.fillCircle(point.x, point.y, 10))
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

import Phaser from 'phaser';
import assets from "../assets";
import {Spider} from "../gameobjects/Spider";
import {semanticColors} from "./colors";
import {debugGraphicsConfig} from "../gameobjects/graphics";

export default class MainScene extends Phaser.Scene {
    private spider: Spider;
    private textPath: Phaser.GameObjects.Text[];
    private debugGraphics: Phaser.GameObjects.Graphics;
    private foodImage: Phaser.GameObjects.Image;

    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.audio(assets.sounds.notification.key, assets.sounds.notification.filepath);
        this.load.image(assets.images.food.key, assets.images.food.filepath);
    }

    create() {
        this.debugGraphics = this.add.graphics(debugGraphicsConfig)
        this.cameras.main.setZoom(0.5);
        this.spider = new Spider(this)
        this.cameras.main.centerOn(this.spider.x, this.spider.y);
        const lerpingFactor = 0.2
        this.cameras.main.startFollow(this.spider, true, lerpingFactor, lerpingFactor);
        this.setupTextPaths()
    }

    setupTextPaths(){
        const dinnerPathPoints = [
            new Phaser.Math.Vector2(-20, 1550),
            new Phaser.Math.Vector2(-500, 1000),
            new Phaser.Math.Vector2(-700, 400),
            new Phaser.Math.Vector2(-500, -400),
            new Phaser.Math.Vector2(-2200, -2000),
        ]
        // dinnerPathPoints.forEach(point => this.debugGraphics.fillCircle(point.x, point.y, 10))

        const textPathStyle = {fontSize: '32px', color: semanticColors.primary, fontFamily: "Times New Roman"}
        const dinnerText = "I arrive at yours quarter past seven. You make me dinner, we talk about life and everything else. We say it’s funny how we haven’t met in so long. We catch up on lost time like old friends. We say let’s do this again before too much time has passed, knowing we won’t. I leave when it gets too late in the evening"
        const dinnerTextChunks = dinnerText.split(/[\s,.]/)
        new Phaser.Curves.Spline(dinnerPathPoints)
            .getSpacedPoints(dinnerTextChunks.length)
            .forEach((point, idx) => {
                this.add.text(point.x, point.y, dinnerTextChunks.at(idx) ?? "", textPathStyle)
                this.add.text(point.x, point.y, " ", textPathStyle)
        })

        const imagePosition = dinnerPathPoints.at(-1)!
        this.foodImage = this.add.image(imagePosition.x, imagePosition.y, assets.images.food.key)

        const points = [
            new Phaser.Math.Vector2(20, 550),
            new Phaser.Math.Vector2(260, 450),
            new Phaser.Math.Vector2(300, 250),
            new Phaser.Math.Vector2(550, 145),
            new Phaser.Math.Vector2(745, 256)
        ].map(v => v.scale(3))
        points.forEach(point => this.debugGraphics.fillCircle(point.x, point.y, 10))
        const path = new Phaser.Curves.Spline(points)
        const storyText = "What if you could trace the lineage of ideas from person to person throughout history"
        this.textPath = path
            .getSpacedPoints(storyText.length)
            .map((point, idx, allSpacedPoints) => {
                const rotation = idx === 0 ? 0 : point.cross(allSpacedPoints[idx - 1])
                return this.add.text(point.x, point.y, storyText.at(idx) ?? "", textPathStyle)
                    .setRotation(rotation)
            })
    }

    update(time: number, _delta: number) {
        this.spider.update(time, _delta)
        this.textPath.forEach(ch => ch.setRotation(ch.rotation + (Math.random() > 0.5 ? .01 : -.01)))
        this.foodImage.setVisible(Math.random() > .98 )
    }
}

import Phaser from 'phaser';
import assets from "../assets";
import {Spider} from "../gameobjects/Spider";
import {HexColor, semanticColors} from "../colors";
import Interactable from "../gameobjects/Interactable";
import {eventEmitter, GameEvent, SceneTrigger} from "../events";
import {getGameHeight, getGameWidth} from "../config";

export const MAIN_SCENE = "MainScene"

export default class MainScene extends Phaser.Scene {
    private spider: Spider;
    private textPath: Phaser.GameObjects.Text[];
    private foodImage: Phaser.GameObjects.Image;
    private lemonImage: Phaser.GameObjects.Image;
    private limeImage: Phaser.GameObjects.Image;
    private dinnerAssetsGroup: Phaser.GameObjects.Group;
    private backgroundSound: Phaser.Sound.WebAudioSound;
    private readonly isInDebugMode: boolean;

    constructor(debugMode = false) {
        super(MAIN_SCENE);
        this.isInDebugMode = debugMode
    }

    preload() {
        this.load.image(assets.images.food.key, assets.images.food.filepath);
        this.load.image(assets.images.lemon.key, assets.images.lemon.filepath);
        this.load.image(assets.images.lime.key, assets.images.lime.filepath);
        this.load.image(assets.images.star.key, assets.images.star.filepath);
        this.load.audio(assets.sounds.background.key, assets.sounds.background.filepath);
        this.load.audio(assets.sounds.notification.key, assets.sounds.notification.filepath);
        assets.images.ghosts.map(ghostAsset =>
            this.load.image(ghostAsset.key, ghostAsset.filepath
        ))
    }

    create() {
        if (this.isInDebugMode) {
            const sceneFrame = new Phaser.Geom.Rectangle(
                -getGameWidth(),
                -getGameHeight(),
                getGameWidth() * 2,
                getGameHeight() * 2
            )
            const graphics = this.add.graphics({
                fillStyle: {color: HexColor.white},
                lineStyle: {width: 0.5, color: HexColor.white, alpha: 1.0}
            })
            graphics.strokeRectShape(sceneFrame)
        }
        this.spider = new Spider(this)
        this.cameras.main.centerOn(this.spider.x, this.spider.y);
        const lerpingFactor = 0.2
        this.cameras.main.startFollow(this.spider, true, lerpingFactor, lerpingFactor);
        this.setupTextPaths()
        this.backgroundSound = this.sound.add(assets.sounds.background.key) as Phaser.Sound.WebAudioSound
        this.backgroundSound.play({loop: true})
        const notificationSound = this.sound.add(assets.sounds.notification.key) as Phaser.Sound.WebAudioSound

        new Interactable(this, new Phaser.Math.Vector2(900, 0), SceneTrigger.DINNER, assets.images.ghosts[0])
        new Interactable(this, new Phaser.Math.Vector2(1300, 200), SceneTrigger.CHOIR, assets.images.ghosts[1])
        new Interactable(this, new Phaser.Math.Vector2(700, -500), SceneTrigger.STUDENT, assets.images.ghosts[2])

        eventEmitter.on(GameEvent.SCREEN1_UPDATE, () => notificationSound.play({ loop: false }))

    }

    setupTextPaths(){
        const dinnerPathPoints = [
            new Phaser.Math.Vector2(-700, 1550),
            new Phaser.Math.Vector2(-500, 1000),
            new Phaser.Math.Vector2(-700, 400),
            new Phaser.Math.Vector2(-500, -400),
            new Phaser.Math.Vector2(-2200, -2000),
        ]

        const textPathStyle = {fontSize: '32px', color: semanticColors.primary, fontFamily: "Times New Roman"}
        const dinnerText = "I arrive at yours quarter past seven. You make me dinner, we talk about life and everything else. We say it’s funny how we haven’t met in so long. We catch up on lost time like old friends. We say let’s do this again before too much time has passed, knowing we won’t. I leave when it gets too late in the evening"
        const dinnerTextChunks = dinnerText.split(/[\s,.]/)
        const dinnerPath = new Phaser.Curves.Spline(dinnerPathPoints)
        dinnerPath
            .getSpacedPoints(dinnerTextChunks.length)
            .forEach((point, idx) => {
                this.add.text(point.x, point.y, dinnerTextChunks.at(idx) ?? "", textPathStyle)
                this.add.text(point.x, point.y, " ", textPathStyle)
            })

        const imagePosition = dinnerPathPoints.at(-1)!
        this.limeImage = this.add.image(
            imagePosition.x,
            imagePosition.y,
            assets.images.lime.key
        ).setScale(0.5, 0.5)
        this.foodImage = this.add.image(
            imagePosition.x - 300,
            imagePosition.y - 200,
            assets.images.food.key
        ).setVisible(false)
        this.lemonImage = this.add.image(
            imagePosition.x - 300,
            imagePosition.y + 100,
            assets.images.lemon.key
        ).setScale(0.5, 0.5).setVisible(false)
        this.dinnerAssetsGroup = this.add.group([
            this.limeImage,
            this.lemonImage,
            this.foodImage,
        ])

        const points = [
            new Phaser.Math.Vector2(20, 550),
            new Phaser.Math.Vector2(260, 450),
            new Phaser.Math.Vector2(300, 250),
            new Phaser.Math.Vector2(550, 145),
            new Phaser.Math.Vector2(745, 256)
        ].map(v => v.scale(3))
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

        const distanceBetweenSpiderAndFoodImage = this.limeImage.getCenter().distance({x: this.spider.x, y: this.spider.y})
        const distanceThreshold = 500
        if (distanceBetweenSpiderAndFoodImage < distanceThreshold) {
            this.dinnerAssetsGroup.setVisible(true)
            this.dinnerAssetsGroup.rotate(Math.random() > 0.5 ? .01 : -.01)
            this.backgroundSound.setRate(Math.max(0.3, distanceBetweenSpiderAndFoodImage / distanceThreshold))
        }
        else {
            this.limeImage.setVisible(Math.random() > .98 )
            this.lemonImage.setVisible(false)
            this.foodImage.setVisible(false)
        }

        const pan = Math.min(Math.max(this.spider.x / innerWidth, -0.9), 0.9);
        const detune = Math.min(Math.max(this.spider.y, -900), 900); // range between -1200 and 1200
        this.backgroundSound.setPan(pan)
        this.backgroundSound.setDetune(detune)
    }
}

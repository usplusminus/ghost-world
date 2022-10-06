import Phaser from 'phaser';
import assets from "../assets";
import {Spider} from "../gameobjects/Spider";
import {semanticColors} from "../colors";
import Interactable from "../gameobjects/Interactable";
import {eventEmitter, Events} from "../events";
import {shuffleList} from "../math";

export const MAIN_SCENE = "MainScene"

export default class MainScene extends Phaser.Scene {
    private spider: Spider;
    private textPath: Phaser.GameObjects.Text[];
    private foodImage: Phaser.GameObjects.Image;
    private lemonImage: Phaser.GameObjects.Image;
    private limeImage: Phaser.GameObjects.Image;
    private dinnerAssetsGroup: Phaser.GameObjects.Group;
    private backgroundSound: Phaser.Sound.WebAudioSound;
    private interactableElements: Interactable[];

    constructor() {
        super(MAIN_SCENE);
    }

    preload() {
        this.load.image(assets.images.food.key, assets.images.food.filepath);
        this.load.image(assets.images.lemon.key, assets.images.lemon.filepath);
        this.load.image(assets.images.lime.key, assets.images.lime.filepath);
        this.load.image(assets.images.chair1.key, assets.images.chair1.filepath);
        this.load.image(assets.images.chair2.key, assets.images.chair2.filepath);
        this.load.image(assets.images.chair3.key, assets.images.chair3.filepath);
        this.load.image(assets.images.chair4.key, assets.images.chair4.filepath);
        this.load.audio(assets.sounds.background.key, assets.sounds.background.filepath);
        this.load.audio(assets.sounds.wood.key, assets.sounds.wood.filepath);
    }

    create() {
        this.cameras.main.setZoom(0.5);
        this.spider = new Spider(this)
        this.cameras.main.centerOn(this.spider.x, this.spider.y);
        const lerpingFactor = 0.2
        this.cameras.main.startFollow(this.spider, true, lerpingFactor, lerpingFactor);
        this.setupTextPaths()
        this.backgroundSound = this.sound.add(assets.sounds.background.key) as Phaser.Sound.WebAudioSound
        this.backgroundSound.play({loop: true})
        const woodSound = this.sound.add(assets.sounds.wood.key) as Phaser.Sound.WebAudioSound


        this.interactableElements = [
            new Phaser.Math.Vector2(1500, -500),
            new Phaser.Math.Vector2(1300, -200)
        ].map(position => new Interactable(this, position, 50.0, [this.spider]))

        eventEmitter.once(Events.DINNER, () => woodSound.play({ loop: false }))

    }

    setupTextPaths(){
        const dinnerPathPoints = [
            new Phaser.Math.Vector2(-700, 1550),
            new Phaser.Math.Vector2(-500, 1000),
            new Phaser.Math.Vector2(-700, 400),
            new Phaser.Math.Vector2(-500, -400),
            new Phaser.Math.Vector2(-2200, -2000),
        ]

        const chairAssets = shuffleList([
            assets.images.chair1.key,
            assets.images.chair2.key,
            assets.images.chair3.key,
            assets.images.chair4.key
        ].flatMap(k => [k, k, k]))

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
        dinnerPath
            .getSpacedPoints(chairAssets.length)
            .forEach((point, idx) =>
                this.add.image(
                    point.x + 200,
                    point.y,
                    chairAssets[idx]
                ).setScale(0.5, 0.5)
            )

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
        this.interactableElements.forEach(element => element.update())
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

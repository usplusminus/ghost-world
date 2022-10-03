import Phaser from 'phaser';
import assets from "../assets";
import {colors} from "./colors";
import {Player} from "../gameobjects/Player";
import {Spider} from "../gameobjects/Spider";

export default class MainScene extends Phaser.Scene {
    private player: Player;
    private score: number;
    private scoreText: Phaser.GameObjects.Text;
    private debugText: Phaser.GameObjects.Text;
    private bombs: Phaser.Physics.Arcade.Group;
    private gameOver: boolean;
    private stars: Phaser.Physics.Arcade.Group;
    private terrain: Phaser.GameObjects.Image;
    private terrainOutline: Phaser.GameObjects.Rectangle;
    private notificationSound: Phaser.Sound.BaseSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private spider: Spider;

    constructor() {
        super('MainScene');
        this.score = 0
        this.gameOver = false
    }

    preload() {
        this.load.svg(assets.terrain.key, assets.terrain.filepath);
        this.load.image(assets.platforms.platform1.key, assets.platforms.platform1.filepath);
        this.load.image(assets.platforms.platform2.key, assets.platforms.platform2.filepath);
        this.load.image(assets.platforms.platform3.key, assets.platforms.platform3.filepath);
        this.load.image(assets.platforms.platform4.key, assets.platforms.platform4.filepath);
        this.load.image(assets.star.key, assets.star.filepath);
        this.load.image(assets.bomb.key, assets.bomb.filepath);
        this.load.spritesheet(assets.dude.key, assets.dude.filepath,
            {frameWidth: 32, frameHeight: 48}
        );
        this.load.audio(assets.sounds.notification.key, assets.sounds.notification.filepath);
    }

    create() {
        this.cameras.main.setZoom(0.5);
        this.cameras.main.centerOn(0, 0);

        const platforms = this.physics.add.staticGroup()
        platforms.create(400, 568, assets.platforms.platform1.key).setScale(2).refreshBody();
        platforms.create(600, 400, assets.platforms.platform2.key).setScale(2).refreshBody();
        platforms.create(50, 250, assets.platforms.platform3.key).setScale(2).refreshBody();
        platforms.create(750, 220, assets.platforms.platform4.key).setScale(2).refreshBody();

        this.notificationSound = this.sound.add(assets.sounds.notification.key)

        this.terrain = this.add.image(0, -300, assets.terrain.key).setScale(3)
        this.terrainOutline = this.add.rectangle(
            this.terrain.x,
            this.terrain.y,
            this.terrain.width,
            this.terrain.height,
        )
        this.terrainOutline.setStrokeStyle(1, 0x000, 1.0)
        this.terrainOutline.setVisible(false)

        this.player = new Player(this)
        this.spider = new Spider(this)

        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers(assets.dude.key, {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key: assets.dude.key, frame: 4}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(assets.dude.key, {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });

        this.stars = this.physics.add.group({
            key: assets.star.key,
            repeat: 11,
            setXY: {x: 12, y: 0, stepX: 70}
        });

        this.stars.children.iterate((child) =>
            (child as Phaser.Physics.Arcade.Sprite).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        );

        this.physics.add.collider(this.player.sprite, platforms)
        this.physics.add.collider(this.stars, platforms);
        this.physics.add.overlap(this.player.sprite, this.stars, this.collectStar, undefined, this);

        this.scoreText = this.add.text(16, 16, `score: ${this.score}`, {fontSize: '32px', color: colors.secondary});
        this.debugText = this.add.text(16, 16, "", {fontSize: '32px', color: colors.secondary});

        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, platforms);
        this.physics.add.collider(this.player.sprite, this.bombs, this.hitBomb, undefined, this);

        const points = [
            20, 550,
            260, 450,
            300, 250,
            550, 145,
            745, 256
        ].map(v => v * 3)
        const path = new Phaser.Curves.Spline(points)
        // const graphics = this.add.graphics();
        // graphics.lineStyle(1, 0x000000, 1);
        // path.draw(graphics, 128);

        const storyText = "What if you could trace the lineage of ideas from person to person throughout history"
        path.getSpacedPoints(storyText.length).map((point, idx) =>
            this.add.text(point.x, point.y, storyText.at(idx) ?? "", {fontSize: '32px', color: colors.secondary})
        )
    }

    collectStar(_: Phaser.Types.Physics.Arcade.GameObjectWithBody, star: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        (star as Phaser.Physics.Arcade.Sprite).disableBody(true, true)
        this.score += 10
        this.scoreText.setText(`score ${this.score}`)
        this.notificationSound.play()

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate((child) => {
                (child as Phaser.Physics.Arcade.Sprite)
                    .enableBody(
                        true,
                        (child as Phaser.Physics.Arcade.Sprite).x,
                        0,
                        true,
                        true
                    )
            })
            const x = (this.player.sprite.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            const bomb = this.bombs.create(x, 16, assets.bomb.key);
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    hitBomb(
        _sprite: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        _bomb: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) {
        this.physics.pause();
        this.gameOver = true;
    }

    update(_time: number, _delta: number) {
        this.player.update(_time, _delta)
        this.spider.update(_time, _delta)
        const distanceBetweenPlayerAndTerrain = Phaser.Math.Distance.BetweenPoints(this.terrain.getCenter(), this.player.sprite.getCenter())
        const thresholdForInteractionDistance = 200
        const distanceRatio = distanceBetweenPlayerAndTerrain / thresholdForInteractionDistance
        if (distanceBetweenPlayerAndTerrain < thresholdForInteractionDistance) {
            const alpha = Math.max(distanceRatio, 0.1)
            this.terrain.setAlpha(alpha, alpha, alpha, alpha)
            const scale = Math.max(distanceRatio, 0.5)
            this.terrain.setScale(scale)
            this.terrainOutline.setVisible(true)
            this.terrainOutline.lineWidth = 5.0 / scale
        } else {
            this.terrain.setAlpha(1)
            this.terrain.setScale(Math.min(distanceRatio, 3))
            this.terrainOutline.setVisible(false)
        }

        this.debugText.setText(`(${this.player.sprite.x.toFixed(0)}, ${this.player.sprite.y.toFixed(0)})`)
        this.debugText.setPosition(this.player.sprite.x, this.player.sprite.y - 50)

        if (this.gameOver) {
            this.add.text(50, 50, `GAME OVER`, {fontSize: '64px', color: colors.secondary});
            this.scoreText.destroy()
            this.scene.pause()
            return
        }
    }
}

import Phaser from 'phaser';
import assets from "../assets";

export default class MainScene extends Phaser.Scene {
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private score: number;
    private scoreText: Phaser.GameObjects.Text;
    private debugText: Phaser.GameObjects.Text;
    private bombs: Phaser.Physics.Arcade.Group;
    private gameOver: boolean;
    private stars: Phaser.Physics.Arcade.Group;
    private terrain: Phaser.GameObjects.Image;
    private terrainOutline: Phaser.GameObjects.Rectangle;


    constructor() {
        super('MainScene');
        this.score = 0
        this.gameOver = false
    }

    preload() {
        this.load.svg(assets.terrain.key, assets.terrain.filepath);
        this.load.image(assets.ground.key, assets.ground.filepath);
        this.load.image(assets.star.key, assets.star.filepath);
        this.load.image(assets.bomb.key, assets.bomb.filepath);
        this.load.spritesheet(assets.dude.key, assets.dude.filepath,
            {frameWidth: 32, frameHeight: 48}
        );
    }

    create() {
        this.cameras.main.setZoom(0.5);
        this.cameras.main.centerOn(0, 0);

        const platforms = this.physics.add.staticGroup()
        platforms.create(400, 568, assets.ground.key).setScale(2).refreshBody();
        platforms.create(600, 400, assets.ground.key);
        platforms.create(50, 250, assets.ground.key);
        platforms.create(750, 220, assets.ground.key);

        this.terrain = this.add.image(0, 0, assets.terrain.key).setScale(3)
        this.terrainOutline = this.add.rectangle(
            this.terrain.x,
            this.terrain.y,
            this.terrain.width,
            this.terrain.height,
        )
        this.terrainOutline.setStrokeStyle(1, 0x000, 1.0)
        this.terrainOutline.setVisible(false)

        this.player = this.physics.add.sprite(100, 450, assets.dude.key);

        this.player.setBounce(0.2);
        // this.player.setCollideWorldBounds(true);

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

        this.physics.add.collider(this.player, platforms)
        this.physics.add.collider(this.stars, platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

        this.scoreText = this.add.text(16, 16, `score: ${this.score}`, {fontSize: '32px'});
        this.debugText = this.add.text(16, 16, "", {fontSize: '32px'});

        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);
    }

    collectStar(_: Phaser.Types.Physics.Arcade.GameObjectWithBody, star: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        (star as Phaser.Physics.Arcade.Sprite).disableBody(true, true)
        this.score += 10
        this.scoreText.setText(`score ${this.score}`)

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
            const x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            const bomb = this.bombs.create(x, 16, assets.bomb.key);
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    hitBomb(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        _bomb: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) {
        this.physics.pause();
        (player as Phaser.Physics.Arcade.Sprite).setTint(0xff0000);
        (player as Phaser.Physics.Arcade.Sprite).anims.play('turn');
        this.gameOver = true;
    }

    update(_time: number, _delta: number) {
        const distanceBetweenPlayerAndTerrain = Phaser.Math.Distance.BetweenPoints(this.terrain.getCenter(), this.player.getCenter())
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

        this.debugText.setText(`x ${this.player.x.toFixed(0)} y ${this.player.y.toFixed(0)}`)
        this.debugText.setPosition(this.player.x, this.player.y - 50)

        if (this.gameOver) {
            this.add.text(50, 50, `GAME OVER`, {fontSize: '64px'});
            this.scoreText.destroy()
            this.scene.pause()
            return
        }

        const cursors = this.input.keyboard.createCursorKeys();
        const speed = 320

        if (cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (cursors.down.isDown) {
            this.player.setVelocityY(speed);
        } else {
            this.player.setVelocityY(0)
        }
    }
}

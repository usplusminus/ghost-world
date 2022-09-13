import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private score: number;
    private scoreText: Phaser.GameObjects.Text;
    private bombs: Phaser.Physics.Arcade.Group;
    private gameOver: boolean;
    private stars: Phaser.Physics.Arcade.Group;
    private background: Phaser.GameObjects.TileSprite;


    constructor() {
        super('MainScene');
        this.score = 0
        this.gameOver = false
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude',
            'assets/dude.png',
            {frameWidth: 32, frameHeight: 48}
        );
    }

    create() {
        const {width: canvasWidth, height: canvasHeight} = this.sys.game.canvas;
        this.background = this.add.tileSprite(canvasWidth / 2, canvasHeight / 2, canvasWidth, canvasHeight, 'sky')

        const platforms = this.physics.add.staticGroup()
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');


        this.player = this.physics.add.sprite(100, 450, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });

        this.stars = this.physics.add.group({
            key: 'star',
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
            const bomb = this.bombs.create(x, 16, 'bomb');
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
        this.background.tilePositionY -= 0.5

        if (this.gameOver) {
            this.add.text(50, 50, `GAME OVER`, {fontSize: '64px'});
            this.scoreText.destroy()
            this.scene.pause()
            return
        }

        const cursors = this.input.keyboard.createCursorKeys();
        const speed = 160

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

import Phaser from "phaser";
import assets from "../assets";

export class Player extends Phaser.GameObjects.Graphics {
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene) {
        super(scene);

        this.sprite = this.scene.physics.add.sprite(100, 450, assets.dude.key);
        this.sprite.setBounce(0.2);
        // this.player.setCollideWorldBounds(true);

        this.scene.anims.create({
            key: "left",
            frames: this.scene.anims.generateFrameNumbers(assets.dude.key, {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'turn',
            frames: [{key: assets.dude.key, frame: 4}],
            frameRate: 20
        });

        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers(assets.dude.key, {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    override update(_time: number, _delta: number) {
        const speed = 320

        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-speed);
            this.sprite.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(speed);
            this.sprite.anims.play('right', true);
        } else {
            this.sprite.setVelocityX(0);
            this.sprite.anims.play('turn');
        }

        if (this.cursors.up.isDown) {
            this.sprite.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.sprite.setVelocityY(speed);
        } else {
            this.sprite.setVelocityY(0)
        }
    }

}

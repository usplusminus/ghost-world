import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    private readonly logoKey: string;

    constructor() {
        super('MainScene');
        this.logoKey = "logo"
    }

    preload() {
        this.load.image(this.logoKey, 'assets/phaser3-logo.png');
    }

    create() {
        const logo = this.add.image(400, 70, this.logoKey);

        this.tweens.add({
            targets: logo,
            y: 350,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        });
    }
}

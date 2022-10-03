import Phaser from 'phaser';
import assets from "../assets";
import {Player} from "../gameobjects/Player";
import {Spider} from "../gameobjects/Spider";
import {semanticColors} from "./colors";

export default class MainScene extends Phaser.Scene {
    private player: Player;
    private spider: Spider;

    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.spritesheet(assets.dude.key, assets.dude.filepath,
            {frameWidth: 32, frameHeight: 48}
        );
        this.load.audio(assets.sounds.notification.key, assets.sounds.notification.filepath);
    }

    create() {
        this.cameras.main.setZoom(0.5);
        this.cameras.main.centerOn(0, 0);

        this.player = new Player(this)
        this.spider = new Spider(this)

        this.cameras.main.startFollow(this.player.sprite, true, 0.09, 0.09);

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
        path.getSpacedPoints(storyText.length)
            .map((point, idx) =>
                this.add.text(point.x, point.y, storyText.at(idx) ?? "",
                    {fontSize: '32px', color: semanticColors.primary}
                )
            )
    }

    update(_time: number, _delta: number) {
        this.player.update(_time, _delta)
        this.spider.update(_time, _delta)
    }
}

import Phaser from "phaser";
import {gameConfig} from "./config";
import MainScene from "./scenes/MainScene";
import MirrorScene from "./scenes/MirrorScene";

export const setupGame = (canvasElement: HTMLCanvasElement): Phaser.Game => {
    return new Phaser.Game(
        Object.assign(gameConfig(canvasElement), {
            scene: [MirrorScene, MainScene]
        })
    );
}

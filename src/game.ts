import Phaser from "phaser";
import MainScene from "./scenes/MainScene";
import {gameConfig} from "./config";

export const setupGame = (canvasElement: HTMLCanvasElement): Phaser.Game => {
    return new Phaser.Game(
        Object.assign(gameConfig(canvasElement), {
            scene: [MainScene]
        })
    );
}

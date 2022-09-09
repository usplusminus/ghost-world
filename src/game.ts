import Phaser from "phaser";
import MainScene from "./scenes/MainScene";
import {gameConfig} from "./config";

export const setupGame = (parentElement : HTMLElement): Phaser.Game => {
    return new Phaser.Game(
        Object.assign(gameConfig(parentElement), {
            scene: [MainScene]
        })
    );
}

import Phaser from "phaser";
import {colors} from "./scenes/colors";

export const gameConfig = (canvasElement: HTMLCanvasElement): Phaser.Types.Core.GameConfig => {
    return {
        type: Phaser.CANVAS,
        canvas: canvasElement,
        backgroundColor: colors.primary,
        scale: {
            width: 800,
            height: 600,
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 30 },
                debug: false
            }
        }
    }
}

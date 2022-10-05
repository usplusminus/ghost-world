import Phaser from "phaser";
import {semanticColors} from "./scenes/colors";

export const gameConfig = (canvasElement: HTMLCanvasElement): Phaser.Types.Core.GameConfig => {
    return {
        type: Phaser.CANVAS,
        canvas: canvasElement,
        backgroundColor: semanticColors.background,
        scale: {
            width: canvasElement.width,
            height: canvasElement.height,
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: { x: 0, y: 0 },
                debug: false
            }
        }
    }
}

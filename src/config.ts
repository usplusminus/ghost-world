import Phaser from "phaser";
import {semanticColors} from "./colors";


export const getGameWidth = () => innerWidth * 2
export const getGameHeight = () => innerHeight * 2

export const gameConfig = (canvasElement: HTMLCanvasElement): Phaser.Types.Core.GameConfig => {
    return {
        type: Phaser.CANVAS,
        canvas: canvasElement,
        backgroundColor: semanticColors.background,
        scale: {
            width: canvasElement.width * 2,
            height: canvasElement.height * 2,
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: { x: 0, y: 0 },
                debug: false
            }
        },
        // fps: {
        //     forceSetTimeOut: true,
        //     // panicMax: 0,
        //     // smoothStep: false,
        //     target: 30
        // },
    }
}

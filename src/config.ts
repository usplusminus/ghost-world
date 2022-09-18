import Phaser from "phaser";

export const gameConfig = (parentElement: HTMLElement): Phaser.Types.Core.GameConfig => {
    return {
        type: Phaser.AUTO,
        parent: parentElement,
        backgroundColor: '#33A5E7',
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

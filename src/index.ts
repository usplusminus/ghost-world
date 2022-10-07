import './style.css'
import Phaser from "phaser";
import {gameConfig} from "./config";
import MainScene from "./scenes/MainScene";
import MirrorScene from "./scenes/MirrorScene";

function playScene(scene: Phaser.Scene, canvasElement: HTMLCanvasElement): Phaser.Game {
    return new Phaser.Game(
        Object.assign(gameConfig(canvasElement), {
            scene: scene
        })
    );
}

function main(){
    const appRoot = document.querySelector<HTMLDivElement>('#app')!

    const canvasElement = document.createElement("canvas")
    canvasElement.width = window.innerWidth
    canvasElement.height = window.innerHeight
    appRoot.appendChild(canvasElement)
    const sceneName = window.location.pathname.substring(1) // avoid '/'

    switch(sceneName.toLowerCase()) {
        case "mirror":
            playScene(new MirrorScene(), canvasElement)
            break;
        default:
            playScene(new MainScene(), canvasElement)
            break;
    }
}

main()

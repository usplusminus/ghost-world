import './style.css'
import Phaser from "phaser";
import {gameConfig} from "./config";
import MainScene from "./scenes/MainScene";
import Screen1Scene from "./scenes/Sceen1Scene";
import Screen2Scene from "./scenes/Sceen2Scene";

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


    const sceneName = new URL(window.location.href).searchParams.get("display") ?? "main"

    switch(sceneName.toLowerCase()) {
        case "main":
            playScene(new MainScene(), canvasElement)
            break;
        case "screen1":
            playScene(new Screen1Scene(), canvasElement)
            break;
        case "screen2":
            playScene(new Screen2Scene(), canvasElement)
            break;
        default:
            playScene(new MainScene(), canvasElement)
            break;
    }
}

main()

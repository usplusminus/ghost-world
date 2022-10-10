import './style.css'
import Phaser from "phaser";
import {gameConfig, gameConfigWithoutAudio} from "./config";
import MainScene from "./scenes/MainScene";
import Screen1Scene from "./scenes/Screen1Scene";
import Screen2Scene from "./scenes/Screen2Scene";
import {localTime} from "./time";

function playScene(scene: Phaser.Scene, canvasElement: HTMLCanvasElement): Phaser.Game {
    return new Phaser.Game(
        Object.assign(gameConfig(canvasElement), {
            scene: scene
        })
    );
}

function playSceneWithoutAudio(scene: Phaser.Scene, canvasElement: HTMLCanvasElement): Phaser.Game {
    return new Phaser.Game(
        Object.assign(gameConfigWithoutAudio(canvasElement), {
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


    const url = new URL(window.location.href)
    const sceneName = (url.searchParams.get("display") ?? "main").toLowerCase()
    const isDebugging = url.searchParams.get("debug") == "true"

    switch(sceneName) {
        case "main":
            playScene(new MainScene(isDebugging), canvasElement)
            break;
        case "screen1":
            playSceneWithoutAudio(new Screen1Scene(isDebugging), canvasElement)
            break;
        case "screen2":
            playSceneWithoutAudio(new Screen2Scene(isDebugging), canvasElement)
            break;
        default:
            playScene(new MainScene(isDebugging), canvasElement)
            break;
    }
    console.log("Started scene", sceneName, "at", localTime())
}

main()

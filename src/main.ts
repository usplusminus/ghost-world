import './style.css'
import {setupGame} from "./gameSetup";

const appRoot = document.querySelector<HTMLDivElement>('#app')!

const canvasElement = document.createElement("canvas")
canvasElement.width = window.innerWidth
canvasElement.height = window.innerHeight
appRoot.appendChild(canvasElement)

setupGame(canvasElement)

// import {startSpiders} from "./spider";
// startSpiders(canvasElement)

import './style.css'
import {setupGame} from "./game";

const appRoot = document.querySelector<HTMLDivElement>('#app')!

const header = document.createElement("h1")
header.innerText = `usplusminus`
appRoot.appendChild(header)

const gameContainer = document.createElement("div")
const canvasElement = document.createElement("canvas")
gameContainer.appendChild(canvasElement)
appRoot.appendChild(gameContainer)
setupGame(canvasElement)

// import {startSpiders} from "./spider";
// startSpiders(canvasElement)

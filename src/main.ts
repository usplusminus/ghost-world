import './style.css'

const appRoot = document.querySelector<HTMLDivElement>('#app')!

// const header = document.createElement("h1")
// header.innerText = `usplusminus`
// appRoot.appendChild(header)

const gameContainer = document.createElement("div")
const canvasElement = document.createElement("canvas")
canvasElement.width = window.innerWidth
canvasElement.height = window.innerHeight
gameContainer.appendChild(canvasElement)
appRoot.appendChild(gameContainer)

import {setupGame} from "./gameSetup";
setupGame(canvasElement)

// import {startSpiders} from "./spider";
// startSpiders(canvasElement)

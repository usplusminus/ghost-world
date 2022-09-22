import './style.css'
import {setupGame} from "./game";

const appRoot = document.querySelector<HTMLDivElement>('#app')!

const header = document.createElement("h1")
header.innerText = `usplusminus`
appRoot.appendChild(header)

const gameContainer = document.createElement("div")
appRoot.appendChild(gameContainer)
setupGame(gameContainer)

// import {startSpiders} from "./spider";
// const canvas = document.createElement("canvas")
// appRoot.appendChild(canvas)
// startSpiders(canvas)

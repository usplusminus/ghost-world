import './style.css'
import {setupGame} from "./game";

const appRoot = document.querySelector<HTMLDivElement>('#app')!
const header = document.createElement("h1")
header.innerText = `usplusminus`
const gameContainer = document.createElement("div")
appRoot.appendChild(header)
appRoot.appendChild(gameContainer)
setupGame(gameContainer)

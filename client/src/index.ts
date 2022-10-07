import { io } from "socket.io-client";
import './style.css'
import {setupGame} from "./gameSetup";


const socketClient = io("http://localhost:5555")
socketClient.connect()

socketClient.on("connect", () => {
    console.log("Client ID", socketClient.id);
});

const appRoot = document.querySelector<HTMLDivElement>('#app')!

const canvasElement = document.createElement("canvas")
canvasElement.width = window.innerWidth
canvasElement.height = window.innerHeight
appRoot.appendChild(canvasElement)

setupGame(canvasElement)

import Phaser from "phaser";

export const eventEmitter = new Phaser.Events.EventEmitter();

export const LOCAL_STORAGE_EVENT = "storage"

export enum GameEvent {
    INTERACTABLE = "interactable",
    SPIDER_POSITION_UPDATED = "spider-position-updated",
}


const triggerKey = "trigger"
export const triggerEvent = (event: GameEvent) => {
    localStorage.setItem(triggerKey, event)
}


export const sendTextToScreen1 = (text: string) => {
    localStorage.setItem("screen1", text)
}

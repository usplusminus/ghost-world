import Phaser from "phaser";

export const eventEmitter = new Phaser.Events.EventEmitter();

export const LOCAL_STORAGE_EVENT = "storage"

export enum GameEvent {
    SCREEN1_UPDATE = "screen1Update",
    SPIDER_POSITION_UPDATED = "spider-position-updated",
}


export const screen1StorageKey = "screen1"
export const sendTextToScreen1 = (text: string) => {
    localStorage.setItem(screen1StorageKey, text)
    eventEmitter.emit(GameEvent.SCREEN1_UPDATE)
}

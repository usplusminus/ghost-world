import Phaser from "phaser";

export const eventEmitter = new Phaser.Events.EventEmitter();

export const LOCAL_STORAGE_EVENT = "storage"

export enum GameEvent {
    SCREEN1_UPDATE = "screen1Update",
    SCREEN2_UPDATE = "screen2Update",
    SPIDER_POSITION_UPDATED = "spider-position-updated",
}
export enum SceneTrigger {
    DINNER = "dinner",
    CHOIR = "choir",
    STUDENT = "student"
}


export const screen1StorageKey = "screen1"
export const sendTriggerToScreen1 = (trigger: SceneTrigger) => {
    localStorage.setItem(screen1StorageKey, trigger)
    eventEmitter.emit(GameEvent.SCREEN1_UPDATE)
}
export const screen2StorageKey = "screen2"
export const sendTriggerToScreen2 = (trigger: SceneTrigger) => {
    localStorage.setItem(screen2StorageKey, trigger)
    eventEmitter.emit(GameEvent.SCREEN2_UPDATE)
}

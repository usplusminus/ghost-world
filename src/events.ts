import Phaser from "phaser";

export const eventEmitter = new Phaser.Events.EventEmitter();

export enum Events {
    INTERACTABLE = "interactable",
    SPIDER_POSITION_UPDATED = "spider-position-updated"
}

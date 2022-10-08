import Phaser from 'phaser';
import {LOCAL_STORAGE_EVENT} from "../events";

export const SCREEN2_SCENE = "Screen1Scene"

export default class Screen2Scene extends Phaser.Scene {
    private readonly isInDebugMode: boolean;

    constructor(debugMode = false) {
        super(SCREEN2_SCENE);
        this.isInDebugMode = debugMode
    }

    create() {
        this.cameras.main.setZoom(0.5);
        this.cameras.main.centerOn(0, 0);
        if (this.isInDebugMode){
            this.add.text(- innerWidth + 100, - innerHeight + 100, "Screen 2", {
                fontSize: "128px",
                fontFamily: "Times New Roman"
            })
        }

        addEventListener(LOCAL_STORAGE_EVENT, (storageEvent: StorageEvent) => {
            if (storageEvent.newValue){
                this.text.setText(storageEvent.newValue)
            }
            if (storageEvent.key) {
                localStorage.removeItem(storageEvent.key)
            }
        })
    }
}

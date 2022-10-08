import Phaser from 'phaser';
import {LOCAL_STORAGE_EVENT} from "../events";

export const SCREEN1_SCENE = "Screen1Scene"

export default class Screen1Scene extends Phaser.Scene {
    private text: Phaser.GameObjects.Text;
    private readonly isInDebugMode: boolean;

    constructor(debugMode = false) {
        super(SCREEN1_SCENE);
        this.isInDebugMode = debugMode;
    }

    create() {
        this.cameras.main.setZoom(0.5);
        if (this.isInDebugMode){
            this.add.text(- innerWidth + 100, - innerHeight + 100, "Screen 1", {
                fontSize: "128px",
                fontFamily: "Times New Roman"
            })
        }
        // TODO: center align text based on how long it is and its font size
        this.text = this.add.text(0, 0, "This is screen 1", {
            fontSize: "128px",
            fontFamily: "Times New Roman"
        })
        this.cameras.main.centerOn(this.text.x, this.text.y);

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

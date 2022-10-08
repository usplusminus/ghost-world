import Phaser from 'phaser';
import {LOCAL_STORAGE_EVENT} from "../events";

export const SCREEN2_SCENE = "Screen1Scene"

export default class Screen2Scene extends Phaser.Scene {
    private text: Phaser.GameObjects.Text;

    constructor() {
        super(SCREEN2_SCENE);
    }

    create() {
        this.cameras.main.setZoom(0.5);
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
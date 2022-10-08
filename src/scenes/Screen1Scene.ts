import Phaser from 'phaser';
import {LOCAL_STORAGE_EVENT, screen1StorageKey} from "../events";

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
        this.cameras.main.centerOn(0, 0);
        if (this.isInDebugMode){
            this.add.text(- innerWidth + 100, - innerHeight + 100, "Screen 1", {
                fontSize: "128px",
                fontFamily: "Times New Roman"
            })
        }
        // TODO: center align text based on how long it is and its font size
        const defaultText = this.isInDebugMode
            ? "This is screen 1 with lorem ipsum text l l l l l l l l l orem ipsum textlorem ipsum textlorem ipsum textlorem ipsum textlorem ipsum textlorem ipsum text"
            : "..."
        this.text = this.add.text(-innerWidth / 2, -innerHeight / 2,
            defaultText,
            {
                fontSize: "128px",
                fontFamily: "Times New Roman",
                wordWrap: {
                    width: 3 * innerWidth / 3
                }
            }
        )
        addEventListener(LOCAL_STORAGE_EVENT, (storageEvent: StorageEvent) => {
            if (storageEvent.key !== screen1StorageKey) return
            if (storageEvent.newValue){
                this.text.setText(storageEvent.newValue)
            }
            localStorage.removeItem(storageEvent.key)
        })
    }
}

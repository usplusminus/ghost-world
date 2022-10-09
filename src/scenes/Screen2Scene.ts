import Phaser from 'phaser';
import {LOCAL_STORAGE_EVENT, SceneTrigger, screen2StorageKey} from "../events";
import assets from "../assets";

export const SCREEN2_SCENE = "Screen1Scene"

export default class Screen2Scene extends Phaser.Scene {
    private readonly isInDebugMode: boolean;
    private dinnerImage: Phaser.GameObjects.Image | null;

    constructor(debugMode = false) {
        super(SCREEN2_SCENE);
        this.isInDebugMode = debugMode
    }

    preload() {
        this.load.image(assets.images.chair1.key, assets.images.chair1.filepath);
        this.load.image(assets.images.chair2.key, assets.images.chair2.filepath);
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
        this.dinnerImage = null;
        addEventListener(LOCAL_STORAGE_EVENT, (storageEvent: StorageEvent) => {
            if (storageEvent.key !== screen2StorageKey) return
            if (storageEvent.newValue == null) return
            if (storageEvent.newValue === SceneTrigger.DINNER_SCENE)
                this.updateDinnerScene()
            localStorage.removeItem(storageEvent.key)
        })
    }

    updateDinnerScene(){
        this.dinnerImage == null
            ? this.dinnerImage = this.add.image(0, 0, assets.images.chair1.key)
            : this.dinnerImage.setTexture(assets.images.chair2.key)
    }
}

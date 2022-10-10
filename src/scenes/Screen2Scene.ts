import Phaser from 'phaser';
import {LOCAL_STORAGE_EVENT, SceneTrigger, screen2StorageKey} from "../events";
import assets from "../assets";
import {sampleList} from "../math";

export const SCREEN2_SCENE = "Screen1Scene"

export default class Screen2Scene extends Phaser.Scene {
    private readonly isInDebugMode: boolean;
    private dinnerImages: Phaser.GameObjects.Image[] | null;
    private chairPositions: Phaser.Math.Vector2[];

    constructor(debugMode = false) {
        super(SCREEN2_SCENE);
        this.isInDebugMode = debugMode
    }

    preload() {
        assets.images.chairs.map(chairAsset => this.load.image(chairAsset.key, chairAsset.filepath))
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        if (this.isInDebugMode){
            this.add.text(- innerWidth + 100, - innerHeight + 100, "Screen 2", {
                fontSize: "128px",
                fontFamily: "Times New Roman"
            })
        }
        this.chairPositions = [
            new Phaser.Math.Vector2(- innerWidth / 2, - innerHeight / 2),
            new Phaser.Math.Vector2(innerWidth / 2, - innerHeight / 2),
            new Phaser.Math.Vector2(- innerWidth / 2, innerHeight / 2),
            new Phaser.Math.Vector2(innerWidth / 2, innerHeight / 2),
        ]
        this.dinnerImages = null;
        this.initGameStateListener()
    }

    initGameStateListener(){
        localStorage.removeItem(screen2StorageKey)
        addEventListener(LOCAL_STORAGE_EVENT, (storageEvent: StorageEvent) => {
            if (storageEvent.key !== screen2StorageKey) return
            if (storageEvent.newValue == null) return
            if (storageEvent.newValue === SceneTrigger.DINNER)
                this.updateDinnerScene()
            localStorage.removeItem(storageEvent.key)
        })
    }

    updateDinnerScene(){
        this.dinnerImages == null
            ? this.dinnerImages = this.chairPositions.map(position =>
                this.add.image(position.x, position.y, sampleList(assets.images.chairs).key)
            )
            : this.dinnerImages.map(image => image.setTexture(sampleList(assets.images.chairs).key))
    }
}

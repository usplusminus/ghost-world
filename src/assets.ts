type Asset = {
    key: string,
    filepath: string
}

function asset(filepath: string): Asset {
    return { key: filepath, filepath: filepath }
}

export default {
    sounds: {
        background: asset("assets/sounds/194166__klankbeeld__piezo-shipquay-130708-09_compressed.mp3"),
        wood: asset("assets/sounds/inumaki_esuzaki001.mp3"),
        notification: asset("assets/sounds/notification_polite.wav"),
    },
    images: {
        food: asset("assets/images/food.png"),
        lemon: asset("assets/images/lemon.png"),
        lime: asset("assets/images/lime.png"),
        chairs: [
            asset("assets/images/chair1.png"),
            asset("assets/images/chair2.png"),
            asset("assets/images/chair3.png"),
            asset("assets/images/chair4.png"),
        ]
    }
}

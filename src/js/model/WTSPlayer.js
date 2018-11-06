class WTSPlayer {
    constructor(status) {
        this.wtsPlayerStatus = WTSPlayerStatus
    }

    play() {
        console.log("play")
    }

    pause() {
        console.log("pause")
    }

    stop() {
        console.log("stop")
    }
}

var WTSPlayerStatus = Object.freeze( { "START" : false, "PAUSE" : false, "STOP" : true } )

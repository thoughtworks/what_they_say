class TranscriptionManager {
    constructor(allResults = []) {
        this.allResults = allResults
    }

    add(newResult) {
        if (newResult == null || newResult == "" || newResult == undefined ) {
            return
        }
        
        if (this.allResults[this.allResults.length - 1] == null) {
            this.allResults[this.allResults.length] = newResult
        } else {
            this.allResults[this.allResults.length - 1] = newResult
        }
    }

    finishTranscription() {
        if (this.allResults.slice(-1)[0] != undefined) {
            this.allResults = this.allResults.filter(Boolean);
            this.allResults.push(null)
        }
    }

    getAll() {
        var text = ""
        
        for (var i = 0; i < this.allResults.length; i++ ) {
            console.log(i <= this.allResults.length - 1)
            if (this.allResults[i] != null) {
                text += this.allResults[i]
                if (i < this.allResults.length - 1) {
                    text += " "
                }
            }
        }
        return text
    }

    reset() {
        this.allResults = []
    }
}
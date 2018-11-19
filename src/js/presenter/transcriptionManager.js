class TranscriptionManager {
    constructor(allResults = [], quantity = 1) {
        this.allResults = allResults
        this.resultQuantity = quantity
    }

    add(newResult) {
        if (newResult == null || newResult == "" || newResult == undefined ) {
            return
        }
        this.allResults[this.resultQuantity - 1] = newResult
    }

    finishTranscription() {
        this.resultQuantity++
    }

    getAll() {
        var text = ""

        //fix bug undefined //TODO identify and fix error better way
        var endLimit = this.resultQuantity > this.allResults.length ? this.allResults.length : this.resultQuantity
        //
        for (var i = 0; i < endLimit; i++ ) {
            text += this.allResults[i]
            if (i < this.resultQuantity - 1) {
                text += " "
            }
        }
        return text
    }

    reset() {
        this.allResults = []
        this.resultQuantity = 1
    }
}
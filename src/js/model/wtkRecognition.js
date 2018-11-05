class WTKRecognition {

  constructor(history = "") {
    this.history = history
  }

  makeASentenceAndPutOnHistory(event) {
    this.putSentenceOnHistory(event)
    return this.makeASentence(event)
  }

    makeASentence(event) {
        var partialSentence = ""
        var results = event.results
      
        for (var i=0; i < results.length; i++) {
          if (results[i].length > 0 && results[i][0].confidence > 0.8 && !results[i].isFinal) {
            partialSentence += results[i][0].transcript
          }
        }
      
        return partialSentence
      }

      putSentenceOnHistory(event) {
        var totalSentence = ""
        var results = event.results
        var isFinal = false
      
        for (var i=0; i<results.length; i++) {
          if (results[i].isFinal) {
            isFinal = true
          }
        }

        if (isFinal) {
          for (var i = 0; i < results.length; i++) {
            if (results[i][0]) {
              totalSentence += results[i][0].transcript
            }
          }
        }

        if (this.history != "" && totalSentence != "") {
          this.history += " "
        }
      
        this.history += totalSentence
      }
}
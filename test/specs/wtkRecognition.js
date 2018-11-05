describe('Recognition Tests', () => {
    var eventPartial
    var eventFinal

    beforeEach(function() {
        eventPartial = {
            results : [
                        [
                            {
                                transcript : "Oi eu sou o goku",
                                confidence : 0.9999999776482582
                            }
                        ],
                        {"isFinal" : false}
            ]
        }

        eventFinal = {
            results : [
                        [
                            {
                                transcript : "Oi eu sou o goku",
                                confidence : 0.9999999776482582
                            }
                        ],
                        {"isFinal" : true}
            ]
        }
    });

	it('should generate a sentence', () => { 
        const expectedSentence = "Oi eu sou o goku"
        var wtkRecognition = new WTKRecognition()
        var resultSetence = wtkRecognition.makeASentence(eventPartial)
        expect(resultSetence).toEqual(resultSetence)
    })

    it('should add a sentence to history', () => { 
        const expectedHistory = "Oi eu sou o goku"
        var wtkRecognition = new WTKRecognition()
        wtkRecognition.putSentenceOnHistory(eventFinal)
        expect(expectedHistory).toEqual(wtkRecognition.history)
    })

    it('should add generate and add sentence to history', () => { 
        const expectedHistory = "Oi eu sou o goku Oi eu sou o goku"
        const expectedSentence = "Oi eu sou o goku"

        var wtkRecognition = new WTKRecognition()
        var resultSentence = wtkRecognition.makeASentenceAndPutOnHistory(eventFinal)

        wtkRecognition.makeASentenceAndPutOnHistory(eventFinal)

        expect(expectedSentence).toEqual(resultSentence)
        expect(expectedHistory).toEqual(wtkRecognition.history)
    })
});
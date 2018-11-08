describe('Transcription Container Tests', () => {
    var container


    beforeEach(function() {
        container = new TranscriptionContainerModel(null)
  });

	it('should save object', () => { 
        // var container = new TranscriptionContainerModel("")
        expect(container != null).toEqual(true)
    })
});
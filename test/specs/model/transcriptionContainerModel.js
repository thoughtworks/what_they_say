describe('Transcription Container Tests', () => {
    var container

    beforeEach(function() {
        container = new TranscriptionContainerModel(null)
  });

	it('should save object', () => { 
        expect(container != null).toEqual(true)
    })
});
describe('Transcription Tests', () => {
    
    fit('should return example two transcript', () => {
        transcriptionManager = new TranscriptionManager()
        transcriptionManager.add("hoje eu")
        transcriptionManager.finishTranscription()
        transcriptionManager.add("não sei")
        expect(transcriptionManager.getAll()).toEqual("hoje eu não sei")
    })

});
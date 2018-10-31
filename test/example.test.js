describe('Should not be continuos', () => { 
	it('continous should be false', () => { 
		
		var recognition = new webkitSpeechRecognition();
		setupRecognition(recognition)

	  expect(recognition.continuous) 
		  .toEqual(false); 
		});
});
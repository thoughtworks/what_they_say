describe('Should not be continuos', () => { 

	it('continous should be false', () => { 
		var recognition = new webkitSpeechRecognition();
		setupRecognition(recognition)
	  expect(false) 
		  .toEqual(recognition.continuous); 
		});

		it('interim Results should be true', () => { 
			var recognition = new webkitSpeechRecognition();
			setupRecognition(recognition)
			expect(true) 
				.toEqual(recognition.interimResults); 
			});
});
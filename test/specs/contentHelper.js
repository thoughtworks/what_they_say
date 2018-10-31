describe('Content Functions tests', () => { 

	const transcriptionClass = "transcription-container"
	var fixture

	beforeEach(function() {
    fixture = '<div id="fixture"> </div>'

    document.body.insertAdjacentHTML(
        'afterbegin',
        fixture);
});

	it('should be pt-BR language', () => {
		var language = getCurrentLanguague()
	  expect(language) 
		  .toEqual("pt-BR"); 
		});

		it('should be en-US language', () => {
			var language = getCurrentLanguague("en-US")
			expect(language) 
				.toEqual("en-US"); 
			});

			it('should add transcription class', () => {
				div = document.getElementById("fixture")
				fixture = addClass(div,transcriptionClass)

				expect(transcriptionClass) 
					.toEqual(fixture.className); 
				});
});
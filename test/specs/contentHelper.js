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

			it('should count words quantity', () => {
				var text = "Jamais estaremos satisfeitos "
				 + "enquanto nossos corpos, pesados da fadiga "
				 + "de viagem, não puderem hospedar-se nos hotéis "
				 + "de beira de estrada e nos hotéis das cidades. "
				 + "Não estaremos satisfeitos enquanto a mobilidade "
				 + "básica do negro for apenas de um gueto menor para um maior. "
				 + "Jamais estaremos satisfeitos enquanto nossas crianças tiverem "
				 + "suas individualidades e dignidades roubadas por "
				 + "cartazes que dizem Exclusivo para brancos."

				var count = wordCount(text)

				expect(62) 
					.toEqual(count); 
			});

			it('should remove first words', () => {
				var firstText = "Jamais estaremos satisfeitos "

				var secondText = "estaremos satisfeitos "

				var modifiedText = removeWordAtPosition(firstText,1)

				expect(secondText) 
					.toEqual(modifiedText); 
			});

			it('should remove second words', () => {
				var firstText = "Jamais estaremos satisfeitos "

				 var secondText = "Jamais satisfeitos "

				var modifiedText = removeWordAtPosition(firstText,2)

				expect(secondText) 
					.toEqual(modifiedText); 
			});

			it('should remove third word', () => {
				var firstText = "Jamais estaremos satisfeitos "
				 + "enquanto nossos corpos, pesados da fadiga "

				 var secondText = "Jamais estaremos "
				 + "enquanto nossos corpos, pesados da fadiga "

				var modifiedText = removeWordAtPosition(firstText,3)

				expect(secondText) 
					.toEqual(modifiedText); 
			});

			it('should get first word', () => {
				var firstText = "Jamais estaremos satisfeitos "
				 + "enquanto nossos corpos, pesados da fadiga "

				 var secondText = "Jamais estaremos "
				 + "enquanto nossos corpos, pesados da fadiga "

				var modifiedText = getWordAtPosition(firstText,1)

				expect("Jamais") 
					.toEqual(modifiedText.word); 
			});

			it('should get second word', () => {
				var firstText = "Jamais estaremos satisfeitos "
				 + "enquanto nossos corpos, pesados da fadiga "

				 var secondText = "Jamais estaremos "
				 + "enquanto nossos corpos, pesados da fadiga "

				var modifiedText = getWordAtPosition(firstText,2)

				expect("estaremos") 
					.toEqual(modifiedText.word); 
			});

			it('should get third word', () => {
				var firstText = "Jamais estaremos satisfeitos "
				 + "enquanto nossos corpos, pesados da fadiga "

				 var secondText = "Jamais estaremos "
				 + "enquanto nossos corpos, pesados da fadiga "

				var modifiedText = getWordAtPosition(firstText,3)

				expect("satisfeitos") 
					.toEqual(modifiedText.word); 
			});

			it('should get fourth word', () => {
				var firstText = "Jamais estaremos satisfeitos "
				 + "enquanto nossos corpos, pesados da fadiga "

				 var secondText = "Jamais estaremos satisfeitos "
				 + "enquanto nossos corpos, pesados da fadiga "

				var modifiedText = getWordAtPosition(firstText,4).word

				expect("enquanto") 
					.toEqual(modifiedText); 
			});

			it('should get the interception word fiz', () => {
				var firstText = "eu fiz"
				 var secondText = "eu fiz um"

				var interceptionPoint = getInterceptionWordBeetweenTwoInterimTranscription(firstText,secondText).word

				expect("fiz") 
					.toEqual(interceptionPoint); 
			});

			it('should get the interception word josé', () => {
				var firstText = "eu fiz malabarismo com o seu josé"
				 var secondText = "seu josé um grande amigo nosso moradora do rj"

				var interceptionPoint = getInterceptionWordBeetweenTwoInterimTranscription(firstText,secondText).word

				expect("josé") 
					.toEqual(interceptionPoint); 
			});

			it('should group two interim transcription in one without repeat words', () => {
				var lastTranscription = "eu fiz"
				var actualTranscription = "eu fiz um"

				var finalTranscription = groupInterimTranscription(lastTranscription, actualTranscription)

				expect("eu fiz um") 
					.toEqual(finalTranscription); 
			});

			it('should group two interim transcription in one without repeat words', () => {
				var lastTranscription = "toca raul eu estou muito feliz que você veio"
				var actualTranscription = "veio para o nosso aniversário "

				var finalTranscription = groupInterimTranscription(lastTranscription, actualTranscription)

				expect("toca raul eu estou muito feliz que você veio para o nosso aniversário ") 
					.toEqual(finalTranscription); 
			});
});
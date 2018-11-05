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
				var actualTranscription = "toca raul eu estou muito feliz que você veio para o nosso aniversário "

				var finalTranscription = groupInterimTranscription(lastTranscription, actualTranscription)

				expect("toca raul eu estou muito feliz que você veio para o nosso aniversário ") 
					.toEqual(finalTranscription); 
			});

			it('should group two interim transcription in one without repeat words', () => {
				var lastTranscription = "toca raul eu estou muito feliz que você veio"
				var actualTranscription = "toca raul eu estou muito feliz que você veio"

				var finalTranscription = groupInterimTranscription(lastTranscription, actualTranscription)

				expect("toca raul eu estou muito feliz que você veio") 
					.toEqual(finalTranscription); 
			});

			it('should group two interim transcription in one without repeat words', () => {
				var lastTranscription = "vídeo sobre o som do th em inglês th"
				var actualTranscription = "vídeo sobre o som do th em inglês"

				var finalTranscription = groupInterimTranscription(lastTranscription, actualTranscription)

				expect("vídeo sobre o som do th em inglês th") 
					.toEqual(finalTranscription); 
			});


			it('should group two interim transcription in one without repeat words', () => {
				var lastTranscription = "macaco louco eu sou louco nos vídeos que eu ganho"
				var actualTranscription = "apresente um vídeo com as pessoas"

				var finalTranscription = groupInterimTranscription(lastTranscription, actualTranscription)

				expect("macaco louco eu sou louco nos vídeos que eu ganho apresente um vídeo com as pessoas") 
					.toEqual(finalTranscription); 
			});

			it('should group two interim transcription in one without repeat words', () => {
				var lastTranscription = "vídeo sobre o som do th em inglês eu falei que era um"
				var actualTranscription = "vídeo sobre o som do th em inglês eu falei que era"

				var finalTranscription = groupInterimTranscription(lastTranscription, actualTranscription)

				expect("vídeo sobre o som do th em inglês eu falei que era um") 
					.toEqual(finalTranscription); 
			});

			it('should group two interim transcription in one without repeat words', () => {
				var lastTranscription = "Entra lá e já paga"
				var actualTranscription = "Entra lá e já paga a sua conta e"

				var finalTranscription = groupInterimTranscription(lastTranscription, actualTranscription)

				expect("Entra lá e já paga a sua conta e") 
					.toEqual(finalTranscription); 
			});

			it('should group two interim transcription in one without repeat words', () => {
				var lastTranscription = "Entra lá e já paga a sua conta e"
				var actualTranscription = "Entra lá e já paga a sua conta e"

				var finalTranscription = groupInterimTranscription(lastTranscription, actualTranscription)

				expect("Entra lá e já paga a sua conta e") 
					.toEqual(finalTranscription); 
			});

			it('should group two interim transcription in one without repeat words', () => {
				var lastTranscription = "o apoio da modalmais que é dtvm seja uma corretora de valores"
				
				var actualTranscription = "o apoio da modalmais que é dtvm seja uma corretora de valores que"

				var finalTranscription = groupInterimTranscription(lastTranscription, actualTranscription)

				expect("o apoio da modalmais que é dtvm seja uma corretora de valores que") 
					.toEqual(finalTranscription); 
			});

			it('should group two interim transcription in one without repeat words', () => {
				var lastTranscription = "Azul Brasil que jogaram Azul Brasil "
				+ "          parar de ser trouxa e deixar Roubar o seu   receba tem o apoio da modalmais que é      "
				+ "valores que apoia ou me poupe na      você tá precisando de dinheiro investido para poder realizar "
				+ "os seus sonhos comprar seu carro        já o mundo você precisa investir melhor esse dinheiro e com "
				+ "esse dinheiro e com esse"
				
				var actualTranscription = "já o mundo você precisa investir melhor esse dinheiro e com esse vídeo"

				var finalTranscription = groupInterimTranscription(lastTranscription, actualTranscription)

				expect("Azul Brasil que jogaram Azul Brasil "
				+ "          parar de ser trouxa e deixar Roubar o seu   receba tem o apoio da modalmais que é      "
				+ "valores que apoia ou me poupe na      você tá precisando de dinheiro investido para poder realizar "
				+ "os seus sonhos comprar seu carro        já o mundo você precisa investir melhor esse dinheiro e com "
				+ "esse dinheiro e com esse vídeo") 
					.toEqual(finalTranscription); 
			});

			            it('should have the same words', () => {
				                var lastTranscription = "mas e nao tem nada que hoje eu vou"
				                var actualTranscription = "hoje eu vou"
				
				                var result = isTheSameTranscription(lastTranscription,actualTranscription)
				                console.log(result)
				
				                expect(result).toEqual(true)
				            });
				
				            it('should have not the same words', () => {
				                var lastTranscription = "A gente estava nessa luta mano a mano contra o kaidou até que o mano deu apenas um hit"
				                var actualTranscription = "Que loucura mano é muita confusão e muito hit mano"
				
				                var result = isTheSameTranscription(lastTranscription, actualTranscription)
				
				                expect(result).toEqual(false)
				            });
				
				            it('should group two diffenrent interim transcription', () => {
				                var lastTranscription = "A gente estava nessa luta mano a mano contra o kaidou até que o mano deu apenas um hit"
				                var actualTranscription = "Que loucura mano é muita confusão e muito hit mano"
				
				                var finalTranscription = groupInterimTranscription(lastTranscription, actualTranscription)
				
				                expect("A gente estava nessa luta mano a mano contra o kaidou até que o mano deu apenas um hit Que loucura mano é muita confusão e muito hit mano") 
				                    .toEqual(finalTranscription); 
				            });
});
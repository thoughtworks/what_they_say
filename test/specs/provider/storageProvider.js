describe('Storage Tests', () => {
    var localStorage

    beforeEach(function() {
          localStorage = new ChromeProvider(null)
          spyOn(localStorage, 'save')
          .and.callFake( function(arguments) {
               return true
           })
    });

	it('should save object', () => { 
        const language = new Language("pt-BR")
        localStorage.save(language,function (){})
        expect(localStorage.save).toBeCalled
    })
});
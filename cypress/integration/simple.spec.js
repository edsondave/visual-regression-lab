
context('VRT_colorPallete', () => {

    it('Random color test', () => {
        cy.visit('https://edsondave.github.io/VRT_colorPallete/')
		
		cy.get('#actions > button:nth-child(1)').click();
        cy.screenshot('before');
		
		cy.get('#actions > button:nth-child(1)').click();
		cy.screenshot('after');
		
    });
	
});
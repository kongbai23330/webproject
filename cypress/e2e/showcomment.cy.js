describe('showcomment', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/')
        
        cy.get('[type="email"]').type("Administrator@gmail.com")
        cy.get('[type="password"]').type("!Abc123321123")
        cy.get('[type="submit"]').click()
        cy.get('[href="/comment"]').click()
        cy.get('[type="showcomment"]').first().click()
        
        
  
    })
  })  
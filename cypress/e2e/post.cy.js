describe('post', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/')
        
        cy.get('[type="email"]').type("Administrator@gmail.com")
        cy.get('[type="password"]').type("!Abc123321123")
        cy.get('[type="submit"]').click()
        cy.get('[href="/comment"]').click()
        cy.get('label:contains("Title") + div input').type("Administrator@gmail.com")
        cy.get('label:contains("Content") + div textarea').eq(0).type("Administrator@gmail.com")
        cy.get('label:contains("Author") + div input').type("Administrator@gmail.com")
        cy.get('[type="submit"]').click()
        
  
    })
  })  
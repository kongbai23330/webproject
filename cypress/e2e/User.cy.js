describe('User', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/')
        
        cy.get('[type="email"]').type("Administrator@gmail.com")
        cy.get('[type="password"]').type("!Abc123321123")
        cy.get('[type="submit"]').click()
        cy.get('[href="/comment"]').click()
        cy.get('[href="/User"]').click()
      //   cy.get('[type="title"]').type("Administrator@gmail.com")
      //   cy.get('[type="content"]').type("Administrator@gmail.com")
      //   cy.get('#Author').type("Administrator@gmail.com")
      //   cy.get('[type="submit"]').click()
        
  
    })
  })
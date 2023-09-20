Cypress.Commands.add('login', (username, password, persistent) => {
  cy.session(
    username,
    () => {
      cy.visit('/')
      cy.get('#user-btn').click()
      cy.get('#user-menu-login').click()

      cy.get('input[autocomplete=username]').type(username)

      if (persistent) {
        cy.get('.v-input--selection-controls').click()
      }

      // {enter} causes the form to submit
      cy.get('input[autocomplete=current-password]').type(`${password}{enter}`, { log: false })
    },
    {
      validate: () => {
        cy.getAllLocalStorage().then((result) => {
          expect(result).to.have.keys(['http://localhost:8081'])
          expect(result['http://localhost:8081']).to.have.all.keys(['token', 'lifetime', 'refresh', 'persistent', 'locale'])
        })
      },
    }
  )
})

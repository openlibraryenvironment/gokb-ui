describe('login spec', () => {
  it('logs in without persisten token', () => {
    cy.visit('/')
    cy.get('#user-btn').click()
    cy.get('#user-menu-login').click()

    cy.get('input[autocomplete=username]').type('admin')

    // {enter} causes the form to submit
    cy.get('input[autocomplete=current-password]').type(`${'admin'}{enter}`, { log: false })

    cy.wait(500)

    cy.getAllLocalStorage().then((result) => {
      expect(result).to.have.keys(['http://localhost:8081'])
      expect(result['http://localhost:8081']).to.have.all.keys(['token', 'lifetime', 'refresh', 'persistent', 'locale'])
    })
  })

  it('logs in with persistent token', () => {
    cy.visit('/')
    cy.get('#user-btn').click()
    cy.get('#user-menu-login').click()

    cy.get('input[autocomplete=username]').type('admin')

    cy.get('.v-input--selection-controls').click()

    // {enter} causes the form to submit
    cy.get('input[autocomplete=current-password]').type(`${'admin'}{enter}`, { log: false })

    cy.getAllLocalStorage().then((result) => {
      expect(result).to.have.keys(['http://localhost:8081'])
      expect(result['http://localhost:8081']).to.deep.include({ persistent: 'true' })
    })
  })

  it('automatically refreshes soon to be expired token', () => {
    cy.login('admin', 'admin', true)
    window.localStorage.setItem('lifetime', Date.now() + 30000)
    cy.visit('/search-review')
    cy.getAllLocalStorage().then((result) => {
      expect(result).to.have.keys(['http://localhost:8081'])
      expect(parseInt(result['http://localhost:8081']['persistent'])).to.be.greaterThan(Date.now() + 60000)
    })
  })

  it('log out with login session command', () => {
    cy.visit('/')
    cy.login('admin', 'admin', true)
    cy.get('#user-btn').click()
    cy.get('#user-menu-logout').click()

    cy.getAllLocalStorage().then((result) => {
      expect(result).to.have.keys(['http://localhost:8081'])
      expect(result['http://localhost:8081']).to.have.keys('locale')
    })
  })
})
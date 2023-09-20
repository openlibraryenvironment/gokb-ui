describe('profile spec', () => {
  it('fails profile show without login', () => {
    cy.visit('/#/profiles')
    cy.get('h1[id=title-no-access]')
  })

  it('shows profile page', () => {
    cy.login('tempUser', 'tempUser')
    cy.visit('/#/profiles')

    cy.get('.mdi-email')
  })

  it('updates profile email', () => {
    cy.login('tempUser', 'tempUser')
    cy.visit('/#/profiles')
    cy.get('input[type=email]').clear().type('tempuser@gokb.org')
    cy.get('button[type=submit]').click()
    cy.get('.success')

    cy.get('input[type=email]').should('have.value', 'tempuser@gokb.org')
  })

  it('rejects invalid email', () => {
    cy.login('tempUser', 'tempUser')
    cy.visit('/#/profiles')
    cy.get('input[type=email]').clear().type('tempuser@local')
    cy.get('button[type=submit]').should('be.disabled')
  })

  it('changes password', () => {
    cy.login('tempUser', 'tempUser')
    cy.visit('/#/profiles')
    cy.get('div[id=current-password]').within( () => {
      cy.get('input').type('tempUser')
    })
    cy.get('div[id=new-password]').within( () => {
      cy.get('input').type('newPass')
    })
    cy.get('div[id=repeat-password]').within( () => {
      cy.get('input').type('newPass')
    })
    cy.get('button[type=submit]').click()

    cy.get('.success')

    cy.get('div[id=current-password]').within( () => {
      cy.get('input').type('newPass')
    })
    cy.get('div[id=new-password]').within( () => {
      cy.get('input').type('tempUser')
    })
    cy.get('div[id=repeat-password]').within( () => {
      cy.get('input').type('tempUser')
    })
    cy.get('button[type=submit]').click()
  })

  it('rejects invalid password repeat', () => {
    cy.login('tempUser', 'tempUser')
    cy.visit('/#/profiles')
    cy.get('div[id=current-password]').within( () => {
      cy.get('input').type('tempUser')
    })
    cy.get('div[id=new-password]').within( () => {
      cy.get('input').type('nwPass')
    })
    cy.get('div[id=repeat-password]').within( () => {
      cy.get('input').type('newPass')
    })
    cy.get('button[type=submit]').should('be.disabled')
  })

  it('rejects invalid new password length', () => {
    cy.login('tempUser', 'tempUser')
    cy.visit('/#/profiles')
    cy.get('div[id=current-password]').within( () => {
      cy.get('input').type('tempUser')
    })
    cy.get('div[id=new-password]').within( () => {
      cy.get('input').type('new')
    })
    cy.get('div[id=repeat-password]').within( () => {
      cy.get('input').type('new')
    })
    cy.get('button[type=submit]').should('be.disabled')
  })
})
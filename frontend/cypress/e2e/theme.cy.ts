describe('theme changing', () => {
  it('Connect wallet text', () => {
    cy.visit('http://localhost:3000/')
    cy.findByText('Please connect your wallet to view the market').should(
      'be.visible'
    )
  })
  it('change to dark', () => {
    cy.visit('http://localhost:3000/')

    cy.get('[data-testid="moonIcon"]').should('be.visible')

    cy.get('[data-testid="toggle-color-mode"]').click()

    cy.get('[data-testid="sunIcon"]').should('be.visible')
  })

  it('change  to light', () => {
    cy.visit('http://localhost:3000/')

    cy.get('[data-testid="sunIcon"]').should('be.visible')

    cy.get('[data-testid="toggle-color-mode"]').click()

    cy.get('[data-testid="moonIcon"]').should('be.visible')
  })
})

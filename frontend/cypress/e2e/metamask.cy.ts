describe('metamask', () => {
  it('should connect wallet with success', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-testid="connect-wallet-button"]').click()
  })
})

describe('Sport Video Component', () => {
  it('should toggle visibility and maintain layout', () => {
    cy.visit('/sportvideo');
    cy.get('video-player').should('be.visible');
    cy.get('button.toggle-video').click();
    cy.get('video-player').should('not.be.visible');
  });
});
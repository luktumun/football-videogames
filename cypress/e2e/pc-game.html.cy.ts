describe('pc-game.html component', () => {
  it('should render <youtube-player> correctly', () => {
    cy.visit('/pc-game.html');
    cy.get('youtube-player').should('exist');
  });
});
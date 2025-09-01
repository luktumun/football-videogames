describe('sport-video.html component', () => {
  it('should render <youtube-player> correctly', () => {
    cy.visit('/sport-video.html');
    cy.get('youtube-player').should('exist');
  });
});
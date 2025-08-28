describe('PC Game Video Playback', () => {
  it('should autoplay YouTube video when thumbnail is clicked', () => {
    cy.visit('/games');

    // Fail early if error state is visible
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="game-load-error"]').length > 0) {
        throw new Error('Game load failed. Cannot proceed with test.');
      }
    });

    // Alias first game card
    cy.get('[data-testid^="game-card-"]', { timeout: 10000 })
      .should('exist')
      .first()
      .as('firstCard');

    // Click thumbnail inside first card
    cy.get('@firstCard').within(() => {
      cy.get('[data-testid^="game-thumbnail-"]').should('be.visible');
      cy.get('.video-wrapper').as('videoWrapper').click();
    });

    // Requery iframe after DOM update
    cy.get('@firstCard').within(() => {
      cy.get('[data-testid^="youtube-player-"]', { timeout: 10000 })
        .should('exist')
        .find('iframe')
        .should('be.visible')
        .and(($iframe) => {
          const src = $iframe.attr('src');
          expect(src).to.include('youtube.com/embed/');
          expect(src).to.include('autoplay=1');
        });
    });
  });
});
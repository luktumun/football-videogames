describe('PC Games Page - Full Integration and UI Validation', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/action/find', (req) => {
      console.log('📡 Intercepted fetchGames:', req.body);
      expect(req.body.dataSource).to.eq('Cluster0');
      expect(req.body.database).to.eq('videoplayer');
      expect(req.body.collection).to.eq('videos');
    }).as('fetchGames');

    cy.visit('/');
    cy.url().should('include', '/games');
    cy.wait('@fetchGames', { timeout: 10000 });
  });

  it('should redirect to /games and load game cards from MongoDB', () => {
    cy.wait('@fetchGames').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body?.documents).to.have.length.greaterThan(0);
    });
    cy.get('.game-card').should('have.length.greaterThan', 0);
  });

  it('should show thumbnail and play button before video starts', () => {
    cy.get('.game-card').first().within(() => {
      cy.get('.thumbnail').should('be.visible');
      cy.get('.play-button').should('be.visible');
    });
  });

  it('should toggle to YouTube player and autoplay video on click', () => {
    cy.get('.game-card').first().then(($card) => {
      const cardId = $card.attr('data-testid')?.replace('game-card-', '');
      if (!cardId) return;

      cy.wrap($card).within(() => {
        cy.get('.game-preview').click();
        cy.get(`[data-testid="youtube-player-${cardId}"]`).should('exist');
        cy.get('iframe')
          .should('have.attr', 'src')
          .and('include', 'youtube.com')
          .and('include', 'autoplay=1');
      });
    });
  });

  it('should toggle back to thumbnail when clicked again', () => {
    cy.get('.game-card').first().then(($card) => {
      const cardId = $card.attr('data-testid')?.replace('game-card-', '');
      if (!cardId) return;

      cy.wrap($card).within(() => {
        cy.get('.game-preview').click();
        cy.get(`[data-testid="youtube-player-${cardId}"]`).should('exist');
        cy.get('.game-preview').click({ force: true });
        cy.get('.thumbnail').should('be.visible');
      });
    });
  });

  it('should display Dropbox and magnet links if available', () => {
    cy.get('.game-card').each(($card) => {
      const cardId = $card.attr('data-testid')?.replace('game-card-', '');
      if (!cardId) return;

      cy.wrap($card).within(() => {
        cy.get(`[data-testid="dropbox-link-${cardId}"]`).should('exist');
        cy.get(`[data-testid="magnet-link-${cardId}"]`).should('exist');
      });
    });
  });

  it('should render multi-line descriptions correctly', () => {
    cy.get('.game-card').first().within(() => {
      cy.get('.description-line').should('have.length.greaterThan', 0);
    });
  });

  it('should maintain layout stability with header and footer', () => {
    cy.get('.app-header').should('be.visible');
    cy.get('.nav-buttons').should('be.visible');
    cy.get('.footer').should('contain.text', '© 2025 PC Game Hub');
  });
});
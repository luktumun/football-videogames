describe('PC Games & Sports Videos App', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('should render header and navigation correctly', () => {
      cy.get('.app-header').should('exist');
      cy.get('.logo').should('have.attr', 'src').and('include', 'pcgamesportvideo.png');
      cy.contains('Pc Games & Sport Video').should('exist');
      cy.get('.nav-buttons a').should('have.length', 3);
    });
  
    context('PC Games Section', () => {
      beforeEach(() => {
        cy.get('.nav-btn').contains('PC Games').click();
      });
  
      it('should render game cards with titles and thumbnails', () => {
        cy.get('.game-card').should('exist').each(($card) => {
          cy.wrap($card).find('h2').should('not.be.empty');
          cy.wrap($card).find('.video-preview img').should('have.class', 'thumbnail');
          cy.wrap($card).find('.play-button').should('contain.text', '▶');
        });
      });
  
      it('should toggle video player on thumbnail click', () => {
        cy.get('.game-card').first().within(() => {
          cy.get('.video-preview').click();
          cy.get('youtube-player').should('exist');
        });
      });
  
      it('should show description and download links if available', () => {
        cy.get('.game-card').each(($card) => {
          cy.wrap($card).find('.description h3').should('contain.text', 'Description:');
          cy.wrap($card).find('.description li').should('have.length.greaterThan', 0);
          cy.wrap($card).find('.downloads a.download-link').should('have.attr', 'href').and('include', 'dropbox');
          cy.wrap($card).find('.downloads a.magnet-link').should('have.attr', 'href');
        });
      });
    });
  
    context('Sports Videos Section', () => {
      beforeEach(() => {
        cy.get('.nav-btn').contains('Sports Videos').click();
      });
  
      it('should render video cards with match titles and thumbnails', () => {
        cy.get('.video-card').should('exist').each(($card) => {
          cy.wrap($card).find('h2').should('not.be.empty');
          cy.wrap($card).find('.video-preview img').should('exist');
          cy.wrap($card).find('.play-button').should('contain.text', '▶');
        });
      });
  
      it('should toggle video player on thumbnail click', () => {
        cy.get('.video-card').first().within(() => {
          cy.get('.video-preview').click();
          cy.get('youtube-player').should('exist');
        });
      });
  
      it('should show description and download links if available', () => {
        cy.get('.video-card').each(($card) => {
          cy.wrap($card).find('.description h3').should('contain.text', 'Description:');
          cy.wrap($card).find('.description li').should('have.length.greaterThan', 0);
          cy.wrap($card).find('.downloads a.download-link').should('have.attr', 'href').and('include', 'dropbox');
          cy.wrap($card).find('.downloads a.magnet-link').should('have.attr', 'href');
        });
      });
    });
  
    it('should display footer with copyright', () => {
      cy.get('.footer').should('contain.text', '© 2025 PC Game Hub');
    });
  });
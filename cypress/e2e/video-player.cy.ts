describe('PC Game Video Playback', () => {
    it('should autoplay YouTube video when thumbnail is clicked', () => {
        cy.intercept('POST', 'https://ap-south-1.aws.data.mongodb-api.com/app/data-koewh/endpoint/data/v1/action/find').as('getGames');
        cy.visit('/games');

        // Wait for game cards to render
        cy.wait('@getGames', { timeout: 10000 });
        cy.get('[data-testid^="game-card-"]', { timeout: 10000 }).should('exist');
    
        // Assert thumbnail and play button are visible
        cy.get('[data-testid^="game-card-"]').first().within(() => {
          cy.get('[data-testid="game-thumbnail"]').should('be.visible');
          cy.get('.thumbnail').should('be.visible');
          cy.get('.play-button').should('be.visible');
    
          // Click to trigger video playback
          cy.get('.video-wrapper').click();
        });
    
        // Wait for iframe to appear and validate its attributes
        cy.get('[data-testid^="youtube-player-"] iframe', { timeout: 10000 })
          .should('exist')
          .and('be.visible')
          .and(($iframe) => {
            const src = $iframe.attr('src');
            expect(src).to.include('youtube.com/embed/');
            expect(src).to.include('autoplay=1');
            expect(src).to.include('mute=1');
          });
      });
    });
    
import './commands';

beforeEach(() => {
  cy.viewport(1280, 720); // Consistent screen size
});

Cypress.on('uncaught:exception', (err, runnable) => {
  console.warn('⚠️ Ignored exception:', err.message);
  return false;
});
import './commands';

Cypress.on('uncaught:exception', (err) => {
  // Suppress NG0908 and other zone-related errors
  if (err.message.includes('NG0908')) {
    return false; // Prevent test from failing
  }

  // Allow other errors to fail the test
  return true;
});
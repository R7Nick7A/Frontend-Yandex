/// <reference types="cypress" />

// Add custom commands here if needed 

// Кастомная команда для drag-and-drop
Cypress.Commands.add('dragAndDrop', (sourceSelector: string, targetSelector: string) => {
  cy.get(sourceSelector).trigger('dragstart');
  cy.get(targetSelector).trigger('dragenter');
  cy.get(targetSelector).trigger('dragover');
  cy.get(targetSelector).trigger('drop');
  cy.get(sourceSelector).trigger('dragend');
});

declare global {
  namespace Cypress {
    interface Chainable {
      dragAndDrop(sourceSelector: string, targetSelector: string): Chainable;
    }
  }
}

export {}; 
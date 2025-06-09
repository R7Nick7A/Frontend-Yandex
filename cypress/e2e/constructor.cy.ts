/// <reference types="cypress" />

describe('Burger Constructor Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('postOrder');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('postOrder2');
    cy.intercept('POST', '**', (req) => { console.log('POST URL:', req.url); }).as('anyPost');
    window.localStorage.setItem('accessToken', 'test-token');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавляет булку и начинку в конструктор', () => {
    cy.get('[data-cy="ingredients-category"] li').first().find('button').click();
    cy.get('[data-cy="constructor-bun-top"]').should('exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
    
    cy.get('[data-cy="ingredients-category"] li').eq(1).find('button').click();
    cy.get('[data-cy="constructor-ingredients-list"]').children().should('have.length', 1);
    
    cy.get('[data-cy="ingredients-category"] li').eq(2).find('button').click();
    cy.get('[data-cy="constructor-ingredients-list"]').children().should('have.length', 2);
  });

  it('открывает и закрывает модалку ингредиента', () => {
    cy.get('[data-cy="ingredients-category"] li').first().find('a').click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
    
    cy.get('[data-cy="ingredients-category"] li').eq(1).find('a').click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('создает заказ и очищает конструктор', () => {
    cy.get('[data-cy="ingredients-category"] li').first().find('button').click();
    cy.get('[data-cy="constructor-bun-top"]').should('exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
    
    cy.get('[data-cy="ingredients-category"] li').eq(1).find('button').click();
    cy.get('[data-cy="constructor-ingredients-list"]').children().should('have.length', 1);
    
    cy.get('[data-cy="ingredients-category"] li').eq(2).find('button').click();
    cy.get('[data-cy="constructor-ingredients-list"]').children().should('have.length', 2);
    
    // Логируем состояние конструктора и кнопки заказа
    cy.get('[data-cy="constructor-bun-top"]').then($bunTop => {
      cy.log('Bun top exists:', !!$bunTop.length);
    });
    cy.get('[data-cy="constructor-ingredients-list"]').children().then($children => {
      cy.log('Ingredients count:', $children.length);
    });
    cy.get('[data-cy="order-button"]').then($btn => {
      cy.log('Order button disabled:', $btn.prop('disabled'));
    });
    // Логируем содержимое localStorage
    cy.window().then((win) => {
      cy.log('localStorage.accessToken:', win.localStorage.getItem('accessToken'));
    });
    // Логируем состояние Redux конструктора
    cy.window().then((win) => {
      const anyWin = win as any;
      if (anyWin.store && typeof anyWin.store.getState === 'function') {
        const state = anyWin.store.getState();
        cy.log('Redux constructor state:', JSON.stringify(state.burgerConstructor));
      } else {
        cy.log('Redux store not found on window');
      }
    });
    cy.get('[data-cy="order-button"]').should('not.be.disabled');
    cy.get('[data-cy="order-button"]').click();
    cy.wait('@postOrder');
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('exist');
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
    
    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
    cy.get('[data-cy="constructor-ingredients-list"]').children().should('have.length', 0);
  });
}); 
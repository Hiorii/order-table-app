describe('Menu interactions', () => {
  const baseUrl = Cypress.env('baseUrl');

  beforeEach(() => {
    cy.visit(baseUrl + '/authentication/login', {
      onBeforeLoad: (window) => {
        window.localStorage.setItem('currentUser', JSON.stringify({ username: 'newuser' }));
      }
    });
    cy.visit(baseUrl + '/cat-facts');
  });

  it('opens settings, toggles music on, and moves to cat facts', () => {
    cy.get('.fa-gear').click();
    cy.url().should('include', '/settings');
    cy.get('span').contains('On').click();
    cy.get('span').contains('On').should('have.class', 'underline');
    cy.get('.fa-cat').click();
    cy.url().should('include', '/cat-facts');
  });

  it('opens settings, toggles music off, and moves to cat facts', () => {
    cy.get('.fa-gear').click();
    cy.url().should('include', '/settings');
    cy.get('span').contains('Off').click();
    cy.get('span').contains('Off').should('have.class', 'underline');
    cy.get('.fa-cat').click();
    cy.url().should('include', '/cat-facts');
  });
});

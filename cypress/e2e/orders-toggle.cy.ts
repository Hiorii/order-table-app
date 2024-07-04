describe('Order Table Expand/Collapse E2E Test', () => {
  const baseUrl = Cypress.env('baseUrl');

  beforeEach(() => {
    cy.intercept('GET', 'https://geeksoft.pl/assets/order-data.json', { fixture: 'orders.json' }).as('getOrders');
    cy.visit(baseUrl + '/orders-table');
    cy.wait('@getOrders');
  });

  it('should expand and collapse main rows and see correct table content', () => {
    cy.get('tbody > tr').should('have.length', 3);

    cy.get('tbody > tr').first().click();
    cy.get('tbody > tr').should('have.length', 6);

    cy.get('tbody > tr')
      .eq(1)
      .within(() => {
        cy.get('td').eq(1).should('contain', '1203384');
        cy.get('td').eq(2).should('contain', 'SELL');
      });
    cy.get('tbody > tr')
      .eq(2)
      .within(() => {
        cy.get('td').eq(1).should('contain', '1226230');
        cy.get('td').eq(2).should('contain', 'BUY');
      });

    cy.get('tbody > tr').first().click();
    cy.get('tbody > tr').should('have.length', 3);

    cy.get('tbody > tr').eq(1).click();
    cy.get('tbody > tr').should('have.length', 5);

    cy.get('tbody > tr')
      .eq(3)
      .within(() => {
        cy.get('td').eq(1).should('contain', '1226256');
        cy.get('td').eq(2).should('contain', 'BUY');
      });

    cy.get('tbody > tr').eq(1).click();
    cy.get('tbody > tr').should('have.length', 3);
  });
});

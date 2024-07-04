describe('Order Table Delete Row E2E Test', () => {
  const baseUrl = Cypress.env('baseUrl');

  beforeEach(() => {
    cy.intercept('GET', 'https://geeksoft.pl/assets/order-data.json', { fixture: 'orders.json' }).as('getOrders');
    cy.visit(baseUrl + '/orders-table');
    cy.wait('@getOrders');
  });

  it('should delete a row, confirm modal, and see toast, then delete all groups and see empty component', () => {
    cy.get('tbody > tr').first().click();
    cy.get('tbody > tr').should('have.length', 6);

    cy.get('tbody > tr')
      .eq(1)
      .within(() => {
        cy.get('app-icon').last().click();
      });
    cy.get('div[role="alertdialog"]').should('be.visible');
    cy.get('button.p-confirm-dialog-accept').click();
    cy.get('.p-toast-detail').should('contain', 'Zamknięto zlecenie nr 1203384');

    cy.wait(1500);

    cy.get('tbody > tr')
      .first()
      .within(() => {
        cy.get('app-icon').last().click();
      });
    cy.get('div[role="alertdialog"]').should('be.visible');
    cy.get('button.p-confirm-dialog-accept').click();
    cy.get('.p-toast-detail').should('contain', 'Zamknięto zlecenia nr 1226230, 1226240');

    cy.wait(1500);

    cy.get('tbody > tr').each(($row, index) => {
      if (index === 0) {
        return;
      }
      cy.wrap($row).click();
      cy.get('tbody > tr').each(($childRow, childIndex) => {
        if (childIndex > 0) {
          cy.get('app-icon').last().click();
          cy.get('div[role="alertdialog"]').should('be.visible');
          cy.get('button.p-confirm-dialog-accept').click();
          cy.get('.p-toast-detail').should('contain', 'Zamknięto zlecenia');
        }
      });
    });
    cy.get('app-empty').should('be.visible');
  });
});

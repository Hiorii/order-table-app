describe('ThemeToggleComponent E2E Test', () => {
  const baseUrl = Cypress.env('baseUrl');

  beforeEach(() => {
    cy.visit(baseUrl + '/orders-table');
  });

  it('should load the component and toggle theme based on browser settings', () => {
    cy.clearLocalStorage();

    cy.window().then((win) => {
      cy.stub(win, 'matchMedia')
        .withArgs('(prefers-color-scheme: dark)')
        .returns({
          matches: true,
          addListener: () => {},
          removeListener: () => {}
        });

      cy.reload();
      cy.get('button').should('contain', 'Switch to Light Mode');
      cy.get('button').click();
      cy.get('button').should('contain', 'Switch to Dark Mode');
    });
  });

  it('should load the component and toggle theme based on stored value', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('darkMode', 'true');
    });

    cy.reload();
    cy.get('button').should('contain', 'Switch to Light Mode');
    cy.get('button').click();
    cy.get('button').should('contain', 'Switch to Dark Mode');
  });

  it('should load the component and toggle theme correctly when initially in light mode', () => {
    cy.clearLocalStorage();

    cy.window().then((win) => {
      cy.stub(win, 'matchMedia')
        .withArgs('(prefers-color-scheme: dark)')
        .returns({
          matches: false,
          addListener: () => {},
          removeListener: () => {}
        });

      cy.reload();

      cy.get('button').should('contain', 'Switch to Light Mode');
      cy.get('button').click();
      cy.get('button').should('contain', 'Switch to Dark Mode');
    });
  });
});

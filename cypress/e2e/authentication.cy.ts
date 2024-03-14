describe('Authenticate user', () => {
  const baseUrl = Cypress.env('baseUrl');

  it('redirects to login if not authenticated', () => {
    cy.clearLocalStorage('currentUser');
    cy.visit(baseUrl + '/authentication/login');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('currentUser')).to.be.null;
    });
    cy.url().should('include', '/authentication/login');
    cy.contains('CAT FACTS').should('exist');
  });

  it('navigates to the signup page from login', () => {
    cy.visit(baseUrl + '/authentication/login');
    cy.contains('Sign up').click();
    cy.url().should('include', '/authentication/register');
  });

  it('can sign up and then log in with incorrect user credentials', () => {
    cy.visit(baseUrl + '/authentication/register');
    cy.get('input[name="username"]').type('newuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="passwordRepeat"]').type('password123');
    cy.contains('Sign up').click();

    cy.get('input[name="username"]').type('otheruser');
    cy.get('input[name="password"]').type('password123');
    cy.contains('Sign in').click();
    cy.contains('Incorrect username or password').should('be.visible');
  });

  it('can sign up and then log in with a new user account', () => {
    cy.visit(baseUrl + '/authentication/register');
    cy.get('input[name="username"]').type('newuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="passwordRepeat"]').type('password123');
    cy.contains('Sign up').click();

    cy.get('input[name="username"]').type('newuser');
    cy.get('input[name="password"]').type('password123');
    cy.contains('Sign in').click();

    cy.url().should('include', '/cat-facts');
    cy.contains('Did you know?').should('be.visible');
  });

  it('can log out', () => {
    cy.visit(baseUrl + '/authentication/login', {
      onBeforeLoad: (window) => {
        window.localStorage.setItem('currentUser', JSON.stringify({ username: 'newuser' }));
      }
    });
    cy.visit(baseUrl + '/cat-facts');
    cy.url().should('include', '/cat-facts');
    cy.get('.fa-sign-out').click();
    cy.url().should('include', '/authentication/login');
  });
});

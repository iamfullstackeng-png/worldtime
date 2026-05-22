describe('Timesworld Machine Test — happy path', () => {
  beforeEach(() => {
    cy.clearAllSessionStorage();
    cy.visit('/');
  });

  it('rejects an invalid password', () => {
    cy.url().should('include', '/login');

    cy.findByPlaceholderText(/username or email/i).type('test@example.com');
    cy.findByPlaceholderText(/^password$/i).type('weak');
    cy.findByRole('button', { name: /sign in/i }).click();

    cy.findByText(/password must be at least 8 characters/i).should('be.visible');
    cy.url().should('include', '/login');
  });

  it('logs in, lists countries, filters, paginates, and logs out', () => {
    cy.findByPlaceholderText(/username or email/i).type('test@example.com');
    cy.findByPlaceholderText(/^password$/i).type('ValidPass1!');
    cy.findByRole('button', { name: /sign in/i }).click();

    cy.url().should('not.include', '/login');
    cy.findByRole('heading', { level: 1, name: /welcome/i }).should('be.visible');

    cy.findByRole('heading', { name: /pakistan/i, level: 3 }, { timeout: 10000 }).should(
      'be.visible',
    );
    cy.get('article').should('have.length', 12);

    cy.findByRole('button', { name: /load more/i }).click();
    cy.get('article').should('have.length', 24);

    cy.findByRole('button', { name: /^asia$/i }).click();
    cy.get('article').should('have.length', 12);
    cy.findByRole('heading', { name: /pakistan/i, level: 3 }).should('be.visible');
    cy.findByRole('heading', { name: /^france$/i, level: 3 }).should('not.exist');

    cy.findByRole('button', { name: /^europe$/i }).click();
    cy.get('article').should('have.length', 12);
    cy.findByRole('heading', { name: /^france$/i, level: 3 }).should('be.visible');

    cy.findByRole('button', { name: /^all$/i }).click();

    cy.findByRole('button', { name: /sign out/i }).click();

    cy.url().should('include', '/login');
  });
});

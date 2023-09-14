declare namespace Cypress {
  interface Chainable {
    loginAsStudent(email: string, password: string): Chainable<Element>;
  }
}

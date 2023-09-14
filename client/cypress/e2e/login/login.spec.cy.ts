import { STUDENT_LOGIN } from "../../support/constants";

beforeEach(() => {
  // enten home page
  cy.visit("/");

  // click on login button
  cy.get('a[href="/login"]').first().click();

  // check if the url is correct
  cy.url().should("include", "/login");
});

describe("Login", () => {
  it("should login as student", () => {
    // fill the form
    cy.get('input[name="email"]').type(STUDENT_LOGIN.email);
    cy.get('input[name="password"]').type(STUDENT_LOGIN.password);

    // submit the form
    cy.get("button").contains("Login").click();

    // check if the url is correct
    cy.url().should("include", "/student/dashboard");
  });

  it("should login as company", () => {
    // select company radio button
    cy.get("#company").click();

    // fill the form
    cy.get('input[name="email"]').type("empresa1@email.com");
    cy.get('input[name="password"]').type("123123");

    // submit the form
    cy.get("button").contains("Login").click();

    // check if the url is correct
    cy.url().should("include", "/company/dashboard");
  });
});

describe("Logout", () => {
  it("should logout", () => {
    // fill the form
    cy.get('input[name="email"]').type(STUDENT_LOGIN.email);
    cy.get('input[name="password"]').type(STUDENT_LOGIN.password);

    // submit the form
    cy.get("button").contains("Login").click();

    // check if the url is correct
    cy.url().should("include", "/student/dashboard");

    // click on logout button
    cy.get("a").contains("Sair").click();

    // check if the url is correct
    cy.url().should("include", "/login");
  });
});

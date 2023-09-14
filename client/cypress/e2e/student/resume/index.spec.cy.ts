import { STUDENT_LOGIN } from "../../../support/constants";

describe("Student Resume", () => {
  it.only("should show student resume", () => {
    cy.loginAsStudent(STUDENT_LOGIN.email, STUDENT_LOGIN.password);

    cy.visit("/student/resume");

    cy.url().should("include", "/student/resume");
    cy.get("main").contains("Meu Currículo");

    cy.get("main").contains(STUDENT_LOGIN.email);
  });
});

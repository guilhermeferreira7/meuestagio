import { STUDENT_LOGIN } from "../../../support/constants";

describe("Student Dashboard", () => {
  it("should show student dashboard", () => {
    cy.loginAsStudent(STUDENT_LOGIN.email, STUDENT_LOGIN.password);

    cy.url().should("include", "/student/dashboard");

    cy.get("main").contains("Vagas");
  });

  it("should open menu drawer if on mobile", () => {
    cy.loginAsStudent(STUDENT_LOGIN.email, STUDENT_LOGIN.password);

    cy.viewport("iphone-6");
    cy.get(".btn-ghost").click();

    cy.get("ul").contains("Candidaturas");
  });
});

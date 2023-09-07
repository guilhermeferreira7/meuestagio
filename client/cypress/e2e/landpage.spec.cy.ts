describe("IndexPage", () => {
  it("should open landpage", () => {
    cy.visit("/");
    cy.get("h1").should("contain", "MeuEstagio");
  });
});

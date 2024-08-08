describe("My First Test", () => {
  it("Visits the app", () => {
    cy.visit("http://localhost:5173");
    cy.contains("Welcome to React");
  });
});

import { ProductOption, MainLayout } from "./templates.js";

export const createCartView = (products) => `
  ${MainLayout({
    productOptions: products.map((product) => ProductOption(product)).join(""),
  })}
`;

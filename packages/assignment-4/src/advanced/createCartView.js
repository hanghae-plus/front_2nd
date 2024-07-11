import { MainLayout, CartItem, CartTotal } from "./templates.js";
import { createShoppingCart } from "./createShoppingCart.js";
import { appendSelectOptions } from "./render.js";

export const createCartView = (products) => {
  const cart = createShoppingCart();
  const app = document.getElementById("app");

  const render = () => {
    const items = cart.getItems();
    const { total, discountRate } = cart.getTotal();
    app.innerHTML = MainLayout({ items: window.products });
    document.getElementById("cart-items").innerHTML = items
      .map((item) => CartItem(item))
      .join("");
    document.getElementById("cart-total").innerHTML = CartTotal({
      total,
      discountRate,
    });
    bindEvents();
  };

  const bindEvents = () => {
    const select = document.getElementById("product-select");
    appendSelectOptions({ select, options: products });

    document.getElementById("add-to-cart").addEventListener("click", () => {
      const productId = select.value;
      const product = products.find((p) => p.id === productId);
      cart.addItem(product);
      render();
    });

    document.querySelectorAll(".quantity-change").forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = event.target.getAttribute("data-product-id");
        const change = parseInt(event.target.getAttribute("data-change"));
        const item = cart
          .getItems()
          .find((item) => item.product.id === productId);
        cart.updateQuantity(productId, item.quantity + change);
        render();
      });
    });

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = event.target.getAttribute("data-product-id");
        cart.removeItem(productId);
        render();
      });
    });
  };

  render();
};

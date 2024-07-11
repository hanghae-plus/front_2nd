import { createShoppingCart } from "./createShoppingCart.js";
import { createCartView } from "./createCartView.js";
import { PRODUCTS } from "./store/products.js";

document.getElementById("app").innerHTML = createCartView(PRODUCTS);

const cart = createShoppingCart(PRODUCTS);

document.getElementById("add-to-cart").addEventListener("click", () => {
  const productId = document.getElementById("product-select").value;
  cart.addItem(productId);
  console.log("### getItems():",cart.getItems());
});

document.getElementById("cart-items").addEventListener("click", (event) => {
  const target = event.target;
  const productId = target.dataset.productId;
  if (target.classList.contains("quantity-change")) {
    const change = parseInt(target.dataset.change);
    cart.updateQuantity(productId, change);
  } else if (target.classList.contains("remove-item")) {
    cart.removeItem(productId);
  }
});

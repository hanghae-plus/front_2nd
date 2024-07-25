import { createShoppingCart, PRODUCTS } from "./createShoppingCart";
import { MainLayout, CartItem, CartTotal } from "./templates";

const createDOMelement = (type, html) => {
  const element = document.createElement(type);
  element.innerHTML = html;
  return element;
};

const updateCartItemText = (cartItem, updatedItem) => {
  cartItem.querySelector(
    "span",
  ).textContent = `${updatedItem.product.name} - ${updatedItem.product.price}원 x ${updatedItem.quantity}`;
};

const addButtonOnClick = (shoppingCart) => {
  const selectedProductId = document.getElementById("product-select").value;
  const selectedProduct = PRODUCTS.find(
    (product) => product.id === selectedProductId,
  );

  const cartItemById = document.getElementById(selectedProductId);

  if (cartItemById) {
    const cartItemQuantity =
      shoppingCart.getItemById(selectedProductId).quantity;

    const updatedItem = shoppingCart.updateQuantity(
      selectedProductId,
      cartItemQuantity + 1,
    );

    updateCartItemText(cartItemById, updatedItem);
  } else {
    shoppingCart.addItem(selectedProduct);

    const cartItemsContainer = document.getElementById("cart-items");

    const cartItem = createDOMelement(
      "div",
      CartItem({ product: selectedProduct, quantity: 1 }),
    );
    cartItem.id = selectedProductId;

    cartItemsContainer.appendChild(cartItem);
  }
  updateCartTotal(shoppingCart);
};

const removeCartItem = (shoppingCart, productId) => {
  shoppingCart.removeItem(productId);

  const itemById = document.getElementById(productId);
  itemById.remove();
};

const changeCartQuantity = (shoppingCart, productId, changeType) => {
  const cartItemById = document.getElementById(productId);
  const cartItemQuantity = shoppingCart.getItemById(productId).quantity;

  if (changeType === "1") {
    // increase
    const updatedItem = shoppingCart.updateQuantity(
      productId,
      cartItemQuantity + 1,
    );

    updateCartItemText(cartItemById, updatedItem);
  } else {
    // decrease
    if (cartItemQuantity > 1) {
      const updatedItem = shoppingCart.updateQuantity(
        productId,
        cartItemQuantity - 1,
      );

      updateCartItemText(cartItemById, updatedItem);
    } else {
      removeCartItem(shoppingCart, productId);
    }
  }
};

const updateCartItem = (shoppingCart, clickedButton) => {
  const productId = clickedButton.dataset.productId;

  if (clickedButton.classList.contains("remove-item")) {
    removeCartItem(shoppingCart, productId);
  }

  if (clickedButton.classList.contains("quantity-change")) {
    const changeType = clickedButton.dataset.change;

    changeCartQuantity(shoppingCart, productId, changeType);
  }

  updateCartTotal(shoppingCart);
};

const updateCartTotal = (shoppingCart) => {
  const cartTotalContainer = document.getElementById("cart-total");
  const { total, discountRate } = shoppingCart.getTotal();

  if (!cartTotalContainer.hasChildNodes()) {
    const cartTotal = createDOMelement(
      "span",
      CartTotal({ total: total, discountRate }),
    );
    cartTotalContainer.appendChild(cartTotal);
  } else {
    const cartTotal = cartTotalContainer.querySelector("span");
    cartTotal.innerHTML = CartTotal({
      total,
      discountRate,
    });
  }
};

export const createCartView = () => {
  const newShoppingCart = createShoppingCart();

  const app = document.getElementById("app");
  app.innerHTML = MainLayout({ items: PRODUCTS });

  const addButton = document.getElementById("add-to-cart");
  addButton.addEventListener("click", () => {
    addButtonOnClick(newShoppingCart);
  });

  const cartItems = document.getElementById("cart-items");
  cartItems.addEventListener("click", (event) => {
    updateCartItem(newShoppingCart, event.target);
  });
};

import { createShoppingCart, PRODUCTS } from "./createShoppingCart";
import { MainLayout, CartItem, CartTotal } from "./templates";

const updateCartItemText = ({ cartItem, updatedItem }) => {
  cartItem.querySelector(
    "span",
  ).textContent = `${updatedItem.product.name} - ${updatedItem.product.price}원 x ${updatedItem.quantity}`;
};

const addButtonOnClick = (shoppingCart) => {
  const selectedProductId = document.getElementById("product-select").value;
  const selectedProduct = PRODUCTS.find(
    (product) => product.id === selectedProductId,
  );

  const cartItem = document.getElementById(selectedProductId);

  if (cartItem) {
    const item = shoppingCart.getItemById(selectedProductId);

    const updatedItem = shoppingCart.updateQuantity({
      id: selectedProductId,
      quantity: item.quantity + 1,
    });

    updateCartItemText({ cartItem, updatedItem });
  } else {
    shoppingCart.addItem({ product: selectedProduct });

    const cartItemsContainer = document.getElementById("cart-items");

    const cartItem = document.createElement("div");
    cartItem.innerHTML = CartItem({ product: selectedProduct, quantity: 1 });
    cartItem.id = selectedProductId;

    cartItemsContainer.appendChild(cartItem);
  }

  const { total, discountRate } = shoppingCart.getTotal();
  const cartTotal = document.getElementById("cart-total");
  cartTotal.innerHTML = CartTotal({ total, discountRate });
};

const removeCartItem = (shoppingCart, productId) => {
  shoppingCart.removeItemById(productId);

  const itemById = document.getElementById(productId);

  itemById.remove();
};

const changeCartQuantity = ({ shoppingCart, productId, changeValue }) => {
  const cartItem = document.getElementById(productId);

  const item = shoppingCart.getItemById(productId);

  if (changeValue === "1") {
    const updatedItem = shoppingCart.updateQuantity({
      id: productId,
      quantity: item.quantity + 1,
    });

    updateCartItemText({ cartItem, updatedItem });
  } else {
    if (item.quantity > 1) {
      const updatedItem = shoppingCart.updateQuantity({
        id: productId,
        quantity: item.quantity - 1,
      });
      updateCartItemText({ cartItem, updatedItem });
    } else {
      removeCartItem(shoppingCart, productId);
    }
  }
};

const updateCartItem = ({ shoppingCart, clickedButton }) => {
  const productId = clickedButton.dataset.productId;

  if (clickedButton.classList.contains("remove-item")) {
    removeCartItem(shoppingCart, productId);
  }

  if (clickedButton.classList.contains("quantity-change")) {
    const changeValue = clickedButton.dataset.change;

    changeCartQuantity({ shoppingCart, productId, changeValue });
  }

  const { total, discountRate } = shoppingCart.getTotal();
  const cartTotal = document.getElementById("cart-total");
  cartTotal.innerHTML = CartTotal({ total, discountRate });
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
    updateCartItem({
      shoppingCart: newShoppingCart,
      clickedButton: event.target,
    });
  });
};

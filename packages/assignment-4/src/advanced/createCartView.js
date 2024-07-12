import { createShoppingCart, PRODUCTS } from "./createShoppingCart";
import { MainLayout, CartItem, CartTotal } from "./templates";

const { addItem, removeItemById, getItemById, getTotal, updateQuantity } =
  createShoppingCart();

export const createCartView = () => {
  const app = document.getElementById("app");
  app.innerHTML = MainLayout({ items: PRODUCTS });

  const addButton = document.getElementById("add-to-cart");
  addButton.addEventListener("click", () => {
    addButtonOnClick();
  });

  const cartItems = document.getElementById("cart-items");
  cartItems.addEventListener("click", (event) => {
    updateCartItemByClickElement(event.target);
  });
};

const addButtonOnClick = () => {
  const selectedProductId = document.getElementById("product-select").value;
  const cartItem = document.getElementById(selectedProductId);

  if (cartItem) {
    const item = getItemById(selectedProductId);

    const updatedItem = updateQuantity({
      id: selectedProductId,
      quantity: item.quantity + 1,
    });

    updateCartItemText({ cartItem, updatedItem });
  } else {
    const selectedProduct = PRODUCTS.find(
      (product) => product.id === selectedProductId,
    );

    addItem({ product: selectedProduct });

    const cartItemsContainer = document.getElementById("cart-items");

    const cartItem = document.createElement("div");
    cartItem.innerHTML = CartItem({ product: selectedProduct, quantity: 1 });
    cartItem.id = selectedProductId;

    cartItemsContainer.appendChild(cartItem);
  }

  const { total, discountRate } = getTotal();
  const cartTotal = document.getElementById("cart-total");

  cartTotal.innerHTML = CartTotal({ total, discountRate });
};

const updateCartItemText = ({ cartItem, updatedItem }) => {
  cartItem.querySelector(
    "span",
  ).textContent = `${updatedItem.product.name} - ${updatedItem.product.price}원 x ${updatedItem.quantity}`;
};

const removeCartItemById = (productId) => {
  const itemById = document.getElementById(productId);
  removeItemById(productId);

  itemById.remove();
};

const changeCartQuantity = ({ productId, changeValue }) => {
  const cartItem = document.getElementById(productId);

  const item = getItemById(productId);

  if (changeValue === "-1" && item.quantity === 1) {
    return removeCartItemById(productId);
  }

  const updatedItem = updateQuantity({
    id: productId,
    quantity: item.quantity + Number(changeValue),
  });
  updateCartItemText({ cartItem, updatedItem });
};

const updateCartItemByClickElement = (clickElement) => {
  const productId = clickElement.dataset.productId;

  if (clickElement.classList.contains("remove-item")) {
    removeCartItemById(productId);
  }

  if (clickElement.classList.contains("quantity-change")) {
    const changeValue = clickElement.dataset.change;

    changeCartQuantity({ productId, changeValue });
  }

  const { total, discountRate } = getTotal();
  const cartTotal = document.getElementById("cart-total");
  cartTotal.innerHTML = CartTotal({ total, discountRate });
};

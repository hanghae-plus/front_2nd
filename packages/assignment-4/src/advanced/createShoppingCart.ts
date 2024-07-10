import { CartItem, DiscountDetail, Product } from './type';

const DISCOUNT_THRESHOLD = 10;
const DISCOUNT_RATES: Record<Product['id'], number> = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
};
const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;

let cartItems: CartItem[] = [];

export const createShoppingCart = () => {
  const addItem = (addProduct: Product, quantity?: number) => {
    const findCartItem = cartItems.find(
      (cart) => cart.product.id === addProduct.id
    );

    if (!findCartItem) {
      cartItems.push(new CartItem(addProduct, quantity));
      return;
    }

    findCartItem.increaseQuantity(quantity || 1);
  };

  const removeItem = (productId: string) => {
    cartItems = cartItems.filter(
      (cartItem) => cartItem.product.id !== productId
    );
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const findCartItem = cartItems.find(
      (cartItem) => cartItem.product.id === productId
    );

    if (!findCartItem) {
      return;
    }

    if (newQuantity === 0) {
      removeItem(productId);
    }

    findCartItem.quantity = newQuantity;
  };

  const getItems = () => {
    return cartItems.filter((cartItem) => cartItem.quantity > 0);
  };

  const findItem = (productId: string) => {
    return cartItems.find((cartItem) => cartItem.product.id === productId);
  };

  const calculateDiscountAmount = () => {
    return cartItems.reduce((discountAmt, cartItem) => {
      const productPrice = cartItem.product.price * cartItem.quantity;
      const productId = cartItem.product.id;

      if (cartItem.quantity >= DISCOUNT_THRESHOLD) {
        discountAmt += productPrice * DISCOUNT_RATES[productId];
      }

      return discountAmt;
    }, 0);
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((quantity, cartItem) => {
      quantity += cartItem.quantity;
      return quantity;
    }, 0);
  };

  const getTotal = (): DiscountDetail => {
    const totalPrice = cartItems.reduce((totalPrice, cartItem) => {
      totalPrice += cartItem.product.price * cartItem.quantity;
      return totalPrice;
    }, 0);
    const totalQuantity = getTotalQuantity();

    if (totalQuantity >= BULK_DISCOUNT_THRESHOLD) {
      return {
        total: totalPrice * (1 - BULK_DISCOUNT_RATE),
        discountRate: BULK_DISCOUNT_RATE,
      };
    } else {
      const discountAmt = calculateDiscountAmount();

      return {
        total: totalPrice - discountAmt,
        discountRate: 1 - (totalPrice - discountAmt) / totalPrice,
      };
    }
  };

  const resetCartItem = () => {
    cartItems = [];
  };

  return {
    addItem,
    removeItem,
    updateQuantity,
    getItems,
    findItem,
    getTotal,
    resetCartItem,
  };
};

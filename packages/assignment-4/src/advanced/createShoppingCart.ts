import { DiscountDetail, Product } from './types/type.ts';
import { CartItem } from './entities/cartItem.ts';

const DISCOUNT_THRESHOLD = 10;
const DISCOUNT_RATES: Record<Product['id'], number> = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
};
const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;

let CURRENT_CART_ITMES: CartItem[] = [];

export const createShoppingCart = () => {
  const addItem = (tagetProduct: Product, plusQuantity?: number) => {
    const foundCartItem = findItem(tagetProduct.id);

    if (!foundCartItem) {
      CURRENT_CART_ITMES.push(new CartItem(tagetProduct, plusQuantity));
      return;
    }

    updateQuantity(
      tagetProduct.id,
      foundCartItem.quantity + (plusQuantity ?? 1)
    );
  };

  const removeItem = (targetProductId: string) => {
    CURRENT_CART_ITMES = CURRENT_CART_ITMES.filter(
      (cartItem) => cartItem.product.id !== targetProductId
    );
  };

  const updateQuantity = (targetProductId: string, newQuantity: number) => {
    const foundCartItem = findItem(targetProductId);

    if (!foundCartItem) {
      return;
    }

    if (newQuantity === 0) {
      removeItem(targetProductId);
    }

    foundCartItem.quantity = newQuantity;
  };

  const getCurrentCartItems = () => {
    return CURRENT_CART_ITMES.filter((cartItem) => cartItem.quantity > 0);
  };

  const findItem = (productId: string) => {
    return CURRENT_CART_ITMES.find(
      (cartItem) => cartItem.product.id === productId
    );
  };

  const calculateDiscountAmount = () => {
    return CURRENT_CART_ITMES.reduce((discountAmount, cartItem) => {
      const productPrice = cartItem.product.price * cartItem.quantity;
      const productId = cartItem.product.id;

      if (cartItem.quantity >= DISCOUNT_THRESHOLD) {
        discountAmount += productPrice * DISCOUNT_RATES[productId];
      }

      return discountAmount;
    }, 0);
  };

  const getTotalQuantity = () => {
    return CURRENT_CART_ITMES.reduce((quantity, cartItem) => {
      quantity += cartItem.quantity;
      return quantity;
    }, 0);
  };

  const getTotal = (): DiscountDetail => {
    const totalPrice = CURRENT_CART_ITMES.reduce((totalPrice, cartItem) => {
      totalPrice += cartItem.product.price * cartItem.quantity;
      return totalPrice;
    }, 0);

    const totalQuantity = getTotalQuantity();

    const discountDetail: DiscountDetail = {
      total: 0,
      discountRate: 0,
    };

    if (totalQuantity >= BULK_DISCOUNT_THRESHOLD) {
      discountDetail.total = totalPrice * (1 - BULK_DISCOUNT_RATE);
      discountDetail.discountRate = BULK_DISCOUNT_RATE;
    } else {
      const discountAmount = calculateDiscountAmount();

      const discountTotalPrice = totalPrice - discountAmount;
      const discountRatio = discountTotalPrice / totalPrice;

      discountDetail.total = discountTotalPrice;
      discountDetail.discountRate = 1 - discountRatio;
    }
    return discountDetail;
  };

  const resetCurrentCartItems = () => {
    CURRENT_CART_ITMES = [];
  };

  return {
    addItem,
    removeItem,
    updateQuantity,
    getCurrentCartItems,
    findItem,
    getTotal,
    resetCurrentCartItems,
  };
};

import { CartItem, Coupon } from "../../../types";

export const calculateItemTotal = (item: CartItem) => {
  const { price, discounts } = item.product;
  const { quantity } = item;

  const discount = getMaxApplicableDiscount(item);
  const discountedPrice = price * (1 - discount);

  return discountedPrice * quantity;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  if (!item.product.discounts || item.product.discounts.length === 0) {
    return 0;
  }
  return item.product.discounts.reduce((maxDiscount, d) => {
    return item.quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
  }, 0);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    const itemTotalBeforeDiscount = item.product.price * item.quantity;
    totalBeforeDiscount += itemTotalBeforeDiscount;

    const itemTotalAfterDiscount = calculateItemTotal(item);
    totalAfterDiscount += itemTotalAfterDiscount;
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount *= (1 - selectedCoupon.discountValue / 100);
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount)
  };
};


export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  //updateCart를 return
  return cart.reduce((updatedCart, item) => {
    if (item.product.id === productId) {
      const maxQuantity = item.product.stock;
      const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity)); //수량이 한도초과하지 않도록 함
      if (updatedQuantity > 0) { //수량이 0이 아닌 경우만 updateCart에 추가
        updatedCart.push({ ...item, quantity: updatedQuantity });
      }
    } else {
      updatedCart.push(item);
    }
    return updatedCart;
  }, [] as CartItem[]);
};


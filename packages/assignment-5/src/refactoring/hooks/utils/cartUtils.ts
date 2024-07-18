import { CartItem, Coupon, Discount, Product } from "../../../types";

export const calculateItemTotal = (item: CartItem) => {
  return (
    item.product.price * item.quantity * (1 - getMaxApplicableDiscount(item))
  );
};

export const getMaxDiscount = (items: Discount[]) => {
  return items.reduce((max, current) => {
    if (current.rate > max) {
      return current.rate;
    }
    return max;
  }, 0);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const productDiscount = item.product.discounts;

  const discounts = productDiscount.filter(
    (value) => value.quantity <= item.quantity
  );

  return getMaxDiscount(discounts);
};

const getTotalDiscount = (total: number, selectedCoupon: Coupon | null) => {
  if (!selectedCoupon) {
    return total;
  }

  if (selectedCoupon?.discountType === "amount") {
    return total - selectedCoupon.discountValue;
  }

  if (selectedCoupon?.discountType === "percentage") {
    return (total * (100 - selectedCoupon.discountValue)) / 100;
  }

  return total;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = cart.reduce((acc, current) => {
    return acc + current.product.price * current.quantity;
  }, 0);

  const subTotalAfterDiscount = cart.reduce((acc, current) => {
    const total = calculateItemTotal(current);

    return acc + total;
  }, 0);

  const totalAfterDiscount = getTotalDiscount(
    subTotalAfterDiscount,
    selectedCoupon
  );

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export const getUpdateQuantityCartList = (
  cart: CartItem[],
  productId: string,
  quantity: number
) => {
  return cart.map((value) => {
    if (value.product.id === productId) {
      return {
        product: value.product,
        quantity,
      };
    }

    return value;
  });
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity <= 0) {
    const removeCart = cart.filter((value) => value.product.id !== productId);
    return removeCart;
  }

  const product = cart.find((value) => value.product.id === productId);
  const isExist = !!product;

  if (isExist && product?.product.stock < newQuantity) {
    return getUpdateQuantityCartList(cart, productId, product?.product.stock);
  }

  return getUpdateQuantityCartList(cart, productId, newQuantity);
};

export const getAppliedDiscount = (item: CartItem) => {
  return item?.product?.discounts?.reduce((maxDiscount, currentDiscount) => {
    if (item?.quantity >= currentDiscount.quantity) {
      return Math.max(maxDiscount, currentDiscount.rate);
    }
    return maxDiscount;
  }, 0);
};

export const getRemainingStock = ({
  product,
  cart,
}: {
  product: Product;
  cart: CartItem[];
}) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

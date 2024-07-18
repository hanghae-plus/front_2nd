import {
  calculateCartTotal,
  getMaxApplicableDiscount,
} from './utils/cartUtils';

export const useCartCalculator = (cart, selectedCoupon) => {
  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon);
  };

  const getMaxDiscount = (item) => {
    return getMaxApplicableDiscount(item);
  };

  return { calculateTotal, getMaxDiscount };
};

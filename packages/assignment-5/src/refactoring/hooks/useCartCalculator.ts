import { calculateCartTotal } from './utils/cartUtils';

export const useCartCalculator = (cart, selectedCoupon) => {
  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon);
  };

  return { calculateTotal };
};

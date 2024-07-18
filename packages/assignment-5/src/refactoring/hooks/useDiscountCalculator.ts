import { useMemo } from 'react';
import { CartItem } from '../../types';

interface DiscountCalculatorResult {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
}

const useDiscountCalculator = (cartItems: CartItem[], memberLevel: string): DiscountCalculatorResult => {
  const memberDiscounts = {
    '일반': 0.03,
    '실버': 0.05,
    '골드': 0.07,
    'VIP': 0.1,
  };

  const discountRate = memberDiscounts[memberLevel] ?? 0; //

  const totalBeforeDiscount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const totalDiscount = useMemo(() => {
    const productDiscount = cartItems.reduce((acc, item) => {
      const itemTotal = item.product.price * item.quantity;
      let maxProductDiscount = 0;
      for (const discount of item.product.discounts) {
        if (item.quantity >= discount.quantity) {
          maxProductDiscount = Math.max(maxProductDiscount, discount.rate);
        }
      }
      return acc + (itemTotal * maxProductDiscount);
    }, 0);
  
    const discountAppliedPrice = totalBeforeDiscount - productDiscount;
    const memberDiscount = discountAppliedPrice * discountRate;
  
    return Math.floor((productDiscount + memberDiscount) / 10) * 10; // 10원 단위로 버림
  }, [cartItems, discountRate, totalBeforeDiscount]);
  

  const totalAfterDiscount = useMemo(() => {
    const finalPrice = Math.floor((totalBeforeDiscount - totalDiscount) / 10) * 10;
    return finalPrice;
  }, [totalBeforeDiscount, totalDiscount]);

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export default useDiscountCalculator;

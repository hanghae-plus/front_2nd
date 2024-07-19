import { CartItem } from '../../types';

export const useRemainCount = () => {
  const calcRemain = (item: CartItem) => {
    const { product, quantity } = item;
    const remainCountList = product.discounts.map(
      (discount) => discount.quantity - quantity
    );
    let remainNextDiscount = 0;

    if (remainCountList) {
      for (let i = 0; i < remainCountList.length; i++) {
        if (remainCountList[i] > 0) {
          remainNextDiscount = remainCountList[i];
          return remainNextDiscount;
        }
      }
      return remainNextDiscount;
    }
  };

  return { calcRemain };
};

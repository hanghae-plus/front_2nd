export const useRemainCount = () => {
  const calcRemain = item => {
    const { product, quantity } = item;
    const remainCountList = product.discounts.map(a => a.quantity - quantity);
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

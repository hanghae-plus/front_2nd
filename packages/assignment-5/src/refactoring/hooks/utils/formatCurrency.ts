export const formatCurrency = (price, local = 'ko-KR') => {
  return new Intl.NumberFormat(local).format(price);
};

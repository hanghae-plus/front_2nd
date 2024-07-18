export const convertToPercentage = (value: number, digits: number = 0) => {
  return (value * 100).toFixed(digits);
};

export const localeString = (value: number) => {
  // locale 형식이 다양하게 필요한 경우 추후 추가
  return value.toLocaleString('ko-KR');
};

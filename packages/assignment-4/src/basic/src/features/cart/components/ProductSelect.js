export const createProductSelect = (products) => {
  const createProductOption = (product) => {
    return `<option value="${product.id}">${product.name} - ${product.price}원</option>`;
  };

  return (selectElement) => {
    selectElement.innerHTML = products.map(createProductOption).join('');
  };
};

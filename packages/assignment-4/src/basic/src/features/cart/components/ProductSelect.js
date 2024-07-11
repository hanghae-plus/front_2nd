export function createProductSelect(products) {
  function createProductOption(product) {
    return `<option value="${product.id}">${product.name} - ${product.price}원</option>`;
  }

  return function populateProductSelect(selectElement) {
    selectElement.innerHTML = products.map(createProductOption).join('');
  };
}

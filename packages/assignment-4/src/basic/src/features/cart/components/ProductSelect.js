function createProductOption(product) {
  return `<option value="${product.id}">${product.name} - ${product.price}원</option>`;
}

export function populateProductSelect(selectElement, products) {
  selectElement.innerHTML = products.map(createProductOption).join('');
}

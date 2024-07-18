export const handleAddNewProduct = () => {
  const productWithId = { ...newProduct, id: Date.now().toString() };
  onProductAdd(productWithId);
  setNewProduct({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });
  setShowNewProductForm(false);
};

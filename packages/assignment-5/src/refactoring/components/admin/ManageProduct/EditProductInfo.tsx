import { useProductContext } from "provider/product/useProductContext";

const EditProductInfo = () => {
  const { updateProduct, products, editingProduct, setEditingProduct } =
    useProductContext();

  // #region 상품 정보 업데이트  // 새로운 핸들러 함수 추가
  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      setEditingProduct(updatedProduct);
    }
  };

  // 새로운 핸들러 함수 추가
  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      setEditingProduct(updatedProduct);
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      updateProduct(newProduct);
      setEditingProduct(newProduct);
    }
  };

  if (!editingProduct) {
    return;
  }

  return (
    <>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={editingProduct?.name}
          onChange={(e) =>
            handleProductNameUpdate(editingProduct.id, e.target.value)
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          value={editingProduct?.price}
          onChange={(e) =>
            handlePriceUpdate(editingProduct.id, parseInt(e.target.value))
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <input
          type="number"
          value={editingProduct?.stock}
          onChange={(e) =>
            handleStockUpdate(editingProduct.id, parseInt(e.target.value))
          }
          className="w-full p-2 border rounded"
        />
      </div>
    </>
  );
};

export default EditProductInfo;

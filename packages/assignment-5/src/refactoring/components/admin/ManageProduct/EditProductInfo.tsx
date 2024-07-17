import type { Product } from "types";

interface EditProductInfoProps {
  editingProduct: Product;
  handleProductNameUpdate: (id: string, name: string) => void;
  handlePriceUpdate: (id: string, price: number) => void;
  handleStockUpdate: (id: string, stock: number) => void;
}

const EditProductInfo = ({
  editingProduct,
  handleProductNameUpdate,
  handlePriceUpdate,
  handleStockUpdate,
}: EditProductInfoProps) => {
  return (
    <>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={editingProduct.name}
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
          value={editingProduct.price}
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
          value={editingProduct.stock}
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

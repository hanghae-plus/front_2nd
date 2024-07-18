import { Product } from "../../types.ts";
import { useEditingProduct } from "../hooks";
import { ChangeEvent, PropsWithChildren } from "react";

export interface Props {
  initialProduct: Product;
  completeEdit: (product: Product) => void;
}

export function EditingProduct({
  initialProduct,
  completeEdit,
  children,
}: PropsWithChildren<Props>) {
  const { editingProduct, updateEditingProduct } =
    useEditingProduct(initialProduct);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateEditingProduct("name", e.target.value);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateEditingProduct("price", parseInt(e.target.value));
  };

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateEditingProduct("stock", parseInt(e.target.value));
  };

  const handleEditCompleteButtonClick = () => {
    completeEdit(editingProduct);
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={editingProduct.name}
          onChange={handleNameChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          value={editingProduct.price}
          onChange={handlePriceChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <input
          type="number"
          value={editingProduct.stock}
          onChange={handleStockChange}
          className="w-full p-2 border rounded"
        />
      </div>
      {children}
      <button
        onClick={handleEditCompleteButtonClick}
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </button>
    </div>
  );
}

import { ChangeEvent } from "react";
import { Product } from "../../types.ts";
import { useProductForm } from "../hooks";

export interface Props {
  addNewProduct: (newProduct: Omit<Product, "id">) => void;
}

export function ProductForm({ addNewProduct }: Props) {
  const { productForm, updateProductFormField, resetProductForm } =
    useProductForm();

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateProductFormField("name", e.target.value);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateProductFormField("price", parseInt(e.target.value));
  };

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateProductFormField("stock", parseInt(e.target.value));
  };

  const handleAddButtonClick = () => {
    addNewProduct(productForm);
    resetProductForm();
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
      <div className="mb-2">
        <label
          htmlFor="productName"
          className="block text-sm font-medium text-gray-700"
        >
          상품명
        </label>
        <input
          id="productName"
          type="text"
          value={productForm.name}
          onChange={handleNameChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="productPrice"
          className="block text-sm font-medium text-gray-700"
        >
          가격
        </label>
        <input
          id="productPrice"
          type="number"
          value={productForm.price}
          onChange={handlePriceChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="productStock"
          className="block text-sm font-medium text-gray-700"
        >
          재고
        </label>
        <input
          id="productStock"
          type="number"
          value={productForm.stock}
          onChange={handleStockChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={handleAddButtonClick}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        추가
      </button>
    </div>
  );
}

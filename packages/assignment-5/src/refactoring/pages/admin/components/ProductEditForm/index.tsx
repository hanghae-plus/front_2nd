import React from 'react';
import { Product, Discount } from '../../../../../types';

interface ProductEditFormProps {
  editingProduct: Product;
  newDiscount: Discount;
  handleProductNameUpdate: (productId: string, newName: string) => void;
  handlePriceUpdate: (productId: string, newPrice: number) => void;
  handleStockUpdate: (productId: string, newStock: number) => void;
  handleAddDiscount: (productId: string) => void;
  handleRemoveDiscount: (productId: string, index: number) => void;
  handleEditComplete: () => void;
  setNewDiscount: React.Dispatch<React.SetStateAction<Discount>>;
}

const ProductEditForm = ({
  editingProduct,
  newDiscount,
  handleProductNameUpdate,
  handlePriceUpdate,
  handleStockUpdate,
  handleAddDiscount,
  handleRemoveDiscount,
  handleEditComplete,
  setNewDiscount
}: ProductEditFormProps) => {
  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3 className="text-xl font-semibold mb-4">상품 수정</h3>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={editingProduct.name}
          onChange={(e) => handleProductNameUpdate(editingProduct.id, e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          value={editingProduct.price}
          onChange={(e) => handlePriceUpdate(editingProduct.id, parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <input
          type="number"
          value={editingProduct.stock}
          onChange={(e) => handleStockUpdate(editingProduct.id, parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
        {editingProduct.discounts.map((discount, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span>
              {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
            </span>
            <button
              onClick={() => handleRemoveDiscount(editingProduct.id, index)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        ))}
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="수량"
            value={newDiscount.quantity}
            onChange={(e) => setNewDiscount({ ...newDiscount, quantity: parseInt(e.target.value) })}
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="할인율 (%)"
            value={newDiscount.rate * 100}
            onChange={(e) => setNewDiscount({ ...newDiscount, rate: parseInt(e.target.value) / 100 })}
            className="w-1/3 p-2 border rounded"
          />
          <button
            onClick={() => handleAddDiscount(editingProduct.id)}
            className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            할인 추가
          </button>
        </div>
      </div>
      <button
        onClick={handleEditComplete}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
      >
        수정 완료
      </button>
    </div>
  );
};

export default ProductEditForm;

import type { ChangeEvent } from 'react';
import { useCallback, useId, useState } from 'react';

import type { Product } from '../../../types';

interface NewProductForm {
  onAddNewProduct: (newProduct: Product) => void;
}

interface UpdateNewProduct<K extends keyof Product> {
  key: K;
  value: Product[K];
}

export default function NewProductForm({ onAddNewProduct }: NewProductForm) {
  const newProductId = useId();
  const [newProduct, setNewProduct] = useState<Product>({
    id: newProductId,
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const updateNewProduct = <K extends keyof Product>({
    key,
    value,
  }: UpdateNewProduct<K>) => {
    setNewProduct({ ...newProduct, [key]: value });
  };

  const handleNewProductSubmit = useCallback(() => {
    if (!newProduct.name) {
      alert('상품명을 입력해주세요.');
      return;
    }
    if (newProduct.price <= 0) {
      alert('상품 가격을 입력해주세요.');
      return;
    }
    if (newProduct.stock <= 0) {
      alert('상품 재고를 입력해주세요.');
      return;
    }
    onAddNewProduct(newProduct);
  }, [onAddNewProduct, newProduct]);

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
          value={newProduct.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            updateNewProduct({ key: 'name', value: e.target.value });
          }}
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
          value={newProduct.price}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateNewProduct({ key: 'price', value: e.target.valueAsNumber })
          }
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
          value={newProduct.stock}
          onChange={(e) =>
            updateNewProduct({ key: 'stock', value: e.target.valueAsNumber })
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={handleNewProductSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        추가
      </button>
    </div>
  );
}

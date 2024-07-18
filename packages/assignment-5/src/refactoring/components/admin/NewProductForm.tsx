import type { ChangeEvent } from 'react';
import type { Product } from '../../../types'
import { useProductForm } from '../../hooks/index.ts';
 
interface Props {
  onProductAdd: (newProduct: Product) => void;
}
interface NewProductForm {
  onAddNewProduct: (newProduct: Product) => void;
}

export const  NewProductForm = ({onProductAdd}:Props) => {
	const { newProduct, editProperty, submit } = useProductForm(onProductAdd);
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
            editProperty('name', e.target.value);
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
            editProperty('price', e.target.valueAsNumber)
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
          onChange={(e) => editProperty('stock', e.target.valueAsNumber)}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={submit}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        추가
      </button>
    </div>
  );
}

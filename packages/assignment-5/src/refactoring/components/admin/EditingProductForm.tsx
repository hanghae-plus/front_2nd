import type { ReactElement } from 'react';

import type { useEditingProduct } from '../../hooks/useEditingProduct.ts';
import type { Product } from '../../../types.ts';

type EditingProduct = Omit<ReturnType<typeof useEditingProduct>, 'edit'> & {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  children?: ReactElement;
};

export const EditingProductForm = ({
  editingProduct,
  editProperty,
  submit,
  children,
}: EditingProduct) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={editingProduct?.name}
          onChange={(e) => editProperty('name', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          value={editingProduct?.price}
          onChange={(e) => editProperty('price', e.target.valueAsNumber)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <input
          type="number"
          value={editingProduct?.stock}
          onChange={(e) => editProperty('stock', e.target.valueAsNumber)}
          className="w-full p-2 border rounded"
        />
      </div>
      {children}
      <button
        onClick={submit}
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </button>
    </div>
  );
};

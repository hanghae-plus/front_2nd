import type { Product } from '../../../types';
import { useDiscountForm } from '../../hooks/useDiscountForm.ts';

interface DiscountForm {
  products: Product[];
  productId: Product['id'];
  onProductUpdate: (updatedProduct: Product) => void;
}

export const DiscountForm = ({
  products,
  productId,
  onProductUpdate,
}: DiscountForm) => {
  const product = products.find((product) => product.id === productId)!;
  const { discount, editProperty, add, remove } = useDiscountForm(
    product,
    onProductUpdate,
  );

  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
      {product.discounts.map((discount, index) => (
        <div
          key={`${discount.quantity}-${discount.rate}`}
          className="flex justify-between items-center mb-2"
        >
          <span>
            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
          </span>
          <button
            onClick={() => remove(index)}
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
          value={discount.quantity}
          onChange={(e) => editProperty('quantity', e.target.valueAsNumber)}
          className="w-1/3 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="할인율 (%)"
          value={discount.rate * 100}
          onChange={(e) => editProperty('rate', e.target.valueAsNumber / 100)}
          className="w-1/3 p-2 border rounded"
        />
        <button
          onClick={() => add()}
          className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          할인 추가
        </button>
      </div>
    </div>
  );
};

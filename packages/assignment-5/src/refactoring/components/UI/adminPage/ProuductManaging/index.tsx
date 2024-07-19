import { useContext, useState } from 'react';
import { Subtitle } from '../../common/Subtitle';
import { ProductInfo } from './ProductInfo';
import { ProductAddingForm } from './ProductAddingForm';
import { ProductsContext } from '../../../../contexts';

export const ProductManaging = () => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const { products } = useContext(ProductsContext);

  return (
    <div>
      <Subtitle>상품 관리</Subtitle>
      <button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>
      {showNewProductForm && (
        <ProductAddingForm setShowNewProductForm={setShowNewProductForm} />
      )}
      <div className="space-y-2">
        {products.map((product, index) => (
          <ProductInfo key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
};

import { useContext } from 'react';
import { ProductsContext } from '../../../../contexts';
import { Subtitle } from '../../common/Subtitle';
import { ProductInfo } from './ProductInfo';

export const ProductList = () => {
  const { products } = useContext(ProductsContext);

  return (
    <div>
      <Subtitle>상품 목록</Subtitle>
      <div className="space-y-2">
        {products.map((product) => {
          return <ProductInfo key={product.id} product={product} />;
        })}
      </div>
    </div>
  );
};

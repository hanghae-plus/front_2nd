import { Product } from '../../../types.ts';
import { ProductsList } from './ProductsList';
import { NewProductForm } from './NewProductForm';

interface Props {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
}

export const ProductAdministration = ({ products, onProductUpdate, onProductAdd }: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
      <NewProductForm onProductAdd={onProductAdd} />
      <ProductsList products={products} onProductUpdate={onProductUpdate} onProductAdd={onProductAdd} />
    </div>
  );
};

import type { Product } from "types";
import ShoppingCart from "cart/ShoppingCart";
import ProductList from "cart/ProductList";

interface CartPageProps {
  products: Product[];
}

export const CartPage = ({ products }: CartPageProps) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductList>
          <ProductList.ProductList>
            {products.map((product) => (
              <ProductList.ProductItem key={product.id} product={product} />
            ))}
          </ProductList.ProductList>
        </ProductList>
        <ShoppingCart />
      </div>
    </div>
  );
};

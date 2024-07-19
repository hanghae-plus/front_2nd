import { Coupon, Product } from "../../types.ts";
import { CartContainer } from "../components/cart/CartContainer.tsx";
import { ProductContainer } from "../components/product/ProductContainer.tsx";

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductContainer products={products} />
        <CartContainer coupons={coupons} />
      </div>
    </div>
  );
};

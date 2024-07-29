import { isZeroLengthArray } from "@/refactoring/utils/typeNarrowFunctions";
import { CartItem, Product } from "@/types";
import ProductListRow from "./ProductListRow";

interface Props {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
}

const ProductListCard = ({ products, cart, addToCart }: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
      <div className="space-y-2">
        {!isZeroLengthArray(products) &&
          products.map((product) => {
            return (
              <ProductListRow
                key={`product-${product.id}`}
                product={product}
                cart={cart}
                addToCart={addToCart}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ProductListCard;

import { CartItem as TCartItem, Product } from "../../../../types";
import { ProductItem } from "./ProductItem";
import { getMaxDiscount, getRemainingStock } from "../utils";

interface Props {
  cart: TCartItem[];
  products: Product[];
  addToCart: (product: Product) => void;
}

export const ProductList = ({ cart, products, addToCart }: Props) => (
  <div className="space-y-2">
    {products.map(product => (
      <ProductItem
        key={product.id}
        product={product}
        addToCart={addToCart}
        remainingStock={getRemainingStock(product, cart)}
        maxDiscount={getMaxDiscount(product.discounts)}
      />
    ))}
  </div>
);

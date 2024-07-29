import {
  getMaxDiscount,
  getRemainingStock,
} from "@/refactoring/utils/cartUtils";
import { CartItem, Product } from "@/types";
import { useCallback, useMemo } from "react";
import ProductListRowView from "./view";

interface Props {
  product: Product;
  cart: CartItem[];
  addToCart: (product: Product) => void;
}
const ProductListRow = ({ product, cart, addToCart }: Props) => {
  const maxDiscount = useMemo(() => getMaxDiscount(product), [product]);
  const remainingStock = useMemo(
    () => getRemainingStock(cart, product),
    [cart, product]
  );
  const isRemain = useMemo(() => remainingStock > 0, [remainingStock]);

  const onClickAddToCart = useCallback(
    () => addToCart(product),
    [addToCart, product]
  );

  const props = {
    product,
    maxDiscount,
    remainingStock,
    isRemain,
    onClickAddToCart,
  };

  return <ProductListRowView {...props} />;
};

export default ProductListRow;

import { CartItem, Product } from "@/types";
import { useCallback, useMemo } from "react";
import ProductListRowView from "./view";

interface Props {
  product: Product;
  cart: CartItem[];
  addToCart: (product: Product) => void;
}
const ProductListRow = ({ product, cart, addToCart }: Props) => {
  const maxDiscount = useMemo(() => {
    return product.discounts.reduce(
      (max, discount) => Math.max(max, discount.rate),
      0
    );
  }, [product.discounts]);

  const remainingStock = useMemo(() => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  }, [cart, product.id, product.stock]);

  const isRemain = useMemo(() => {
    return remainingStock > 0;
  }, [remainingStock]);

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

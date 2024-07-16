import { CartItem } from "@/types";
import { useMemo } from "react";
import CartProductListRowView from "./view";

interface Props {
  item: CartItem;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
}
const CartProductListRow = ({
  item,
  removeFromCart,
  updateQuantity,
}: Props) => {
  const appliedDiscount = useMemo(() => {
    const { discounts } = item.product;
    const { quantity } = item;
    let appliedDiscount = 0;
    for (const discount of discounts) {
      if (quantity >= discount.quantity) {
        appliedDiscount = Math.max(appliedDiscount, discount.rate);
      }
    }
    return appliedDiscount;
  }, [item]);

  const onClickPlusButton = () =>
    updateQuantity(item.product.id, item.quantity + 1);

  const onClickMinusButton = () =>
    updateQuantity(item.product.id, item.quantity - 1);

  const onClickRemoveButton = () => removeFromCart(item.product.id);

  const props = {
    item,
    onClickPlusButton,
    onClickMinusButton,
    onClickRemoveButton,
    appliedDiscount,
  };
  return <CartProductListRowView {...props} />;
};

export default CartProductListRow;

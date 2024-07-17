import { getAppliedDiscountRate } from "@/refactoring/utils/cartUtils";
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
  const appliedDiscount = useMemo(
    () => getAppliedDiscountRate(item),
    [item.product.discounts, item.quantity]
  );

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

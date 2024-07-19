import { CartItem } from "@/types";
import CartProductListRow from "./CartProductListRow";

interface Props {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
}

const CartProductListCard = ({
  cart,
  removeFromCart,
  updateQuantity,
}: Props) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>

      <div className="space-y-2">
        {cart.map((item) => (
          <CartProductListRow
            key={item.product.id}
            item={item}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
        ))}
      </div>
    </>
  );
};

export default CartProductListCard;

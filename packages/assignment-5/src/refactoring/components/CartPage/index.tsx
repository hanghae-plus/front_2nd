import { useCart } from "@/refactoring/hooks";
import { Coupon, Product } from "@/types.ts";
import Header from "../Header";
import ApplyCouponCard from "./ApplyCouponCard";
import CartProductListCard from "./CartProductListCard";
import CartSummaryCard from "./CartSummaryCard";
import ProductListCard from "./ProductListCard";

interface Props {
  products: Product[];
  coupons: Coupon[];
}

const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal();

  return (
    <div className="container mx-auto p-4">
      <Header title="장바구니" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductListCard
          products={products}
          cart={cart}
          addToCart={addToCart}
        />
        <div>
          <CartProductListCard
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
          <ApplyCouponCard
            coupons={coupons}
            applyCoupon={applyCoupon}
            selectedCoupon={selectedCoupon}
          />
          <CartSummaryCard
            totalBeforeDiscount={totalBeforeDiscount}
            totalAfterDiscount={totalAfterDiscount}
            totalDiscount={totalDiscount}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;

import { Coupon, Product } from "../../types.ts";
import { useCart } from "../hooks";
import CartListBox from "./pages/cart/cart/list/CartListBox.tsx";
import CouponSelectBox from "./pages/cart/coupon/CouponSelectBox.tsx";
import SelectedCouponBox from "./pages/cart/coupon/SelectedCouponBox.tsx";
import ProductListBox from "./pages/cart/product/ProductListBox.tsx";
import CartPageTemplate from "./pages/cart/template/CartPageTemplate.tsx";
import CartTotalBox from "./pages/cart/total/CartTotalBox.tsx";

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
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
    <CartPageTemplate
      ProductList={
        <ProductListBox items={products} cart={cart} addToCart={addToCart} />
      }
      CartList={
        <CartListBox
          items={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />
      }
      CouponSelect={
        <CouponSelectBox items={coupons} applyCoupon={applyCoupon} />
      }
      SelectedCoupon={
        selectedCoupon ? <SelectedCouponBox item={selectedCoupon} /> : null
      }
      CartTotal={
        <CartTotalBox
          totalBeforeDiscount={totalBeforeDiscount}
          totalAfterDiscount={totalAfterDiscount}
          totalDiscount={totalDiscount}
        />
      }
    />
  );
};

import ShoppingCartList from "./ShoppingCartList";
import CouponList from "./CouponList";
import OrderList from "./OrderList";

const ShoppingCart = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
      <ShoppingCartList />
      <CouponList />
      <OrderList />
    </div>
  );
};

export default ShoppingCart;

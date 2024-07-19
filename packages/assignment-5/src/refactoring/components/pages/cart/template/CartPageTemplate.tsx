import { FC, ReactElement } from "react";

interface Props {
  ProductList: ReactElement;
  CartList: ReactElement;
  CouponSelect: ReactElement;
  SelectedCoupon?: ReactElement | null;
  CartTotal: ReactElement;
}

const CartPageTemplate: FC<Props> = ({
  ProductList,
  CartList,
  CouponSelect,
  SelectedCoupon,
  CartTotal,
}) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          {ProductList}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
          {CartList}
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>
            {CouponSelect}
            {SelectedCoupon}
          </div>
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
            {CartTotal}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageTemplate;

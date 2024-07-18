import { FC } from "react";

interface Props {
  totalBeforeDiscount: number;
  totalDiscount: number;
  totalAfterDiscount: number;
}

const CartTotalBox: FC<Props> = ({
  totalBeforeDiscount,
  totalDiscount,
  totalAfterDiscount,
}) => {
  return (
    <div className="space-y-1">
      <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
      <p className="text-green-600">
        할인 금액: {totalDiscount.toLocaleString()}원
      </p>
      <p className="text-xl font-bold">
        최종 결제 금액: {totalAfterDiscount.toLocaleString()}원
      </p>
    </div>
  );
};

export default CartTotalBox;

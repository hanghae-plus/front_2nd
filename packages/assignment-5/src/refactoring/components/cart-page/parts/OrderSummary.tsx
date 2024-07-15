interface Props {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
}

const toCurrency = (price: number) => price.toLocaleString() + '원';

export const OrderSummary = ({ totalBeforeDiscount, totalAfterDiscount, totalDiscount }: Props) => (
  <div className="mt-6 bg-white p-4 rounded shadow">
    <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
    <div className="space-y-1">
      <p>상품 금액: {toCurrency(totalBeforeDiscount)}</p>
      <p className="text-green-600">할인 금액: {toCurrency(totalDiscount)}</p>
      <p className="text-xl font-bold">
        최종 결제 금액: {toCurrency(totalAfterDiscount)}
      </p>
    </div>
  </div>
);

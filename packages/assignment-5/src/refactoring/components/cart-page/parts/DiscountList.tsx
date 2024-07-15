interface Props {
  discounts: { quantity: number; rate: number }[];
}

export const DiscountList = ({ discounts }: Props) => (
  <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
    {discounts.map(({ quantity, rate }, index) => (
      <li key={index}>
        {quantity}개 이상: {(rate * 100).toFixed(0)}% 할인
      </li>
    ))}
  </ul>
);

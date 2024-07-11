import { useEffect, useState } from "react";
import { calculateTotalCost, calculateDiscount } from "../utils";

export default function TotalCost({ cart }) {
  const [totalCost, setTotalCost] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const dcTotalCost = calculateTotalCost(cart);
    const { conclusedTotalCost, totalDc } = calculateDiscount(
      cart,
      dcTotalCost
    );

    setTotalCost(conclusedTotalCost);
    setDiscount(totalDc);
  }, [cart]);

  return (
    <>
      {totalCost > 0 && (
        <div id="cart-total" className="text-xl font-bold my-4">
          총액: {totalCost}원
          {discount > 0 && (
            <span className="text-green-500 ml-2">({discount}% 할인 적용)</span>
          )}
        </div>
      )}
    </>
  );
}

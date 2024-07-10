import { useEffect, useState } from "react";

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

  const calculateTotalCost = (nowCart) => {
    return nowCart.reduce((accumulator, current) => {
      let disc = 0;

      if (current.cnt >= 10) {
        if (current.id === "p1") disc = 0.1;
        else if (current.id === "p2") disc = 0.15;
        else if (current.id === "p3") disc = 0.2;
      }
      const optionTotalCost = current.cost * current.cnt;

      return accumulator + optionTotalCost * (1 - disc);
    }, 0);
  };

  const calculateDiscount = (nowCart, dcTotalCost) => {
    const nowTotalCost = nowCart.reduce((ac, cu) => ac + cu.cost * cu.cnt, 0);
    const totalCnt = nowCart.reduce((ac, cu) => ac + cu.cnt, 0);

    let dc = (nowTotalCost - dcTotalCost) / nowTotalCost;
    let finalDcTotalCost = dcTotalCost;

    if (totalCnt >= 30) {
      const bulkDiscount = dcTotalCost * 0.25;
      const individualDiscount = nowTotalCost - dcTotalCost;
      if (bulkDiscount > individualDiscount) {
        finalDcTotalCost = nowTotalCost * 0.75;
        dc = 0.25;
      }
    }

    return {
      conclusedTotalCost: Math.round(finalDcTotalCost),
      totalDc: (dc * 100).toFixed(1),
    };
  };

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

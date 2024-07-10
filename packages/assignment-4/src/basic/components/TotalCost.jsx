import { useEffect, useState } from "react";

export default function TotalCost({ cart }) {
  const [totalCost, setTotalCost] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const { nowTotalCost, dcTotalCost, totalCnt } = calcurateTotalCost(cart);
    const { conclusedTotalCost, totalDc } = calcurateDiscount(
      nowTotalCost,
      dcTotalCost,
      totalCnt
    );

    setTotalCost(conclusedTotalCost);
    setDiscount(totalDc);
  }, []);

  const calcurateTotalCost = (nowCart) => {
    return nowCart.reduce(
      (accumulator, current) => {
        let disc = 0;

        if (current.cnt >= 10) {
          if (current.id === "p1") disc = 0.1;
          else if (current.id === "p2") disc = 0.15;
          else if (current.id === "p3") disc = 0.2;
        }
        const optionTotalCost = current.cost * current.cnt;

        return {
          nowTotalCost: accumulator.nowTotalCost + optionTotalCost,
          dcTotalCost: accumulator.dcTotalCost + optionTotalCost * (1 - disc),
          totalCnt: accumulator.totalCnt + current.cnt,
        };
      },
      {
        nowTotalCost: 0,
        dcTotalCost: 0,
        totalCnt: 0,
      }
    );
  };

  const calcurateDiscount = (nowTotalCost, dcTotalCost, totalCnt) => {
    let dc = 0;
    let finalDcTotalCost = dcTotalCost;

    if (totalCnt >= 30) {
      const bulkDiscount = dcTotalCost * 0.25;
      const individualDiscount = nowTotalCost - dcTotalCost;
      if (bulkDiscount > individualDiscount) {
        finalDcTotalCost = nowTotalCost * 0.75;
        dc = 0.25;
      } else dc = (nowTotalCost - dcTotalCost) / nowTotalCost;
    } else dc = (nowTotalCost - dcTotalCost) / nowTotalCost;

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
            <span class="text-green-500 ml-2">({discount}% 할인 적용)</span>
          )}
        </div>
      )}
    </>
  );
}

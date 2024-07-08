import { useState, useEffect } from "react";

export default function useCalcurateCost(cart) {
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const total = cart.reduce((accumulator, currentOption) => {
      return accumulator + currentOption.cost * currentOption.cnt;
    }, 0);
    setTotalCost(total);
  }, [cart]);

  return totalCost;
}

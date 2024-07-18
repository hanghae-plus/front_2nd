import { useState } from "react";
import { calculateDiscountedPrice } from "./utils/cartUtils";

export const useDiscountCalculator = (initialPrice: number) => {
  const [price, setPrice] = useState(initialPrice);
  const [discount, setDiscount] = useState(0);

  const calculateFinalPrice = () => {
    return calculateDiscountedPrice(price, discount);
  };

  return {
    price,
    setPrice,
    discount,
    setDiscount,
    calculateFinalPrice,
  };
};

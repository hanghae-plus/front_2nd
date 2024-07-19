import { useContext } from "react";
import { CouponContext } from "./index";

export const useCouponContext = () => {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error("useCouponContext must be used within a CouponProvider");
  }
  return context;
};

import { getRemainingStock } from "./utils/productUtils";

export const useAddProductButtonProps = (
  remainingStock: ReturnType<typeof getRemainingStock>
) => {
  return {
    disabled: remainingStock <= 0,
    buttonText: remainingStock > 0 ? "장바구니에 추가" : "품절",
  };
};

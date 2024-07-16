import { useState } from "react";

export const useProductAccordion = () => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());

  /**
   * accordion product id를 set하는 함수
   * @param productId
   */
  const setProductAccordionId = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return { openProductIds, setProductAccordionId };
};

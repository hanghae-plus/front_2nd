import { useState } from "react";

export const useAccordion = () => {
  const [openedAccordionId, setOpenedAccordion] = useState<Set<string>>(
    new Set()
  );

  /**
   * accordion product id를 set하는 함수
   * @param productId
   */
  const setAccordionId = (productId: string) => {
    setOpenedAccordion((prev) => {
      const newSet = new Set(prev);
      newSet.has(productId) ? newSet.delete(productId) : newSet.add(productId);

      return newSet;
    });
  };

  const toggleAccordion = (productId: string) => {
    setAccordionId(productId);
  };

  return { openedAccordionId, setAccordionId, toggleAccordion };
};

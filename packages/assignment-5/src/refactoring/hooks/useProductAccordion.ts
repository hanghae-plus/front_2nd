import { useState, useCallback } from "react";

export const useProductAccordion = () => {
  const [openProducts, setOpenProducts] = useState<Set<string>>(new Set());

  const toggleProductAccordion = useCallback((productId: string) => {
    setOpenProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  return {
    openProducts,
    toggleProductAccordion,
  };
};

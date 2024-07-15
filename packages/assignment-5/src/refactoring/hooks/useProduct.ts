import { Product } from "@/types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const products: Product[] = structuredClone(initialProducts);

  const updateProduct = (newProduct: Product) => {
    const targetIndex = products.findIndex(
      (product) => product.id === newProduct.id
    );

    if (targetIndex < 0) {
      return;
    }

    products[targetIndex] = newProduct;
  };

  const addProduct = (newProduct: Product) => {
    products.push(newProduct);
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};

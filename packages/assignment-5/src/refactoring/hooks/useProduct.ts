import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    const newProducts = products.map((product) => {
      if (product.id === updatedProduct.id) return updatedProduct;
      return product;
    });
    setProducts(newProducts);
  };

  const addProduct = (newProduct: Product) => {
    setProducts((pre) => [...pre, newProduct]);
  };

  const deleteProduct = (product: Product) => {
    const newProduct = products.filter((item) => product.id !== item.id);
    setProducts(newProduct);
  };

  return { products, updateProduct, addProduct, deleteProduct };
};

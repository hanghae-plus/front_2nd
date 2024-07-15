import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  return { products: [], updateProduct: () => undefined, addProduct: () => undefined };
};

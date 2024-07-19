import { useReducer } from 'react';

import { Product } from '../../models';

interface ProductAction {
  type: 'ADD_PRODUCT' | 'REMOVE_PRODUCT' | 'UPDATE_PRODUCT';
  payload: Product;
}

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 }
    ]
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }]
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }]
  }
];

const productReducer = (state: Product[], action: ProductAction) => {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return [...state, action.payload];
    case 'REMOVE_PRODUCT':
      return state.filter((product) => product.id !== action.payload.id);
    case 'UPDATE_PRODUCT':
      return state.map((product) => (product.id === action.payload.id ? action.payload : product));
    default:
      return state;
  }
};

export const useProduct = () => {
  const [products, dispatch] = useReducer(productReducer, initialProducts);

  const addProduct = (newProduct: Product) => {
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
  };

  const removeProduct = (product: Product) => {
    dispatch({ type: 'REMOVE_PRODUCT', payload: product });
  };

  const updateProduct = (product: Product) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: product });
  };

  return { products, addProduct, removeProduct, updateProduct };
};

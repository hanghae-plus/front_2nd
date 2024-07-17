import { createContext } from 'react';
import { CartItem } from '../../types';

export const CartContext = createContext<CartItem[]>([]);

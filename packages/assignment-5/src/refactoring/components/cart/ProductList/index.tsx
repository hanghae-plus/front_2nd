// components/cart/CartList.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { Product, CartItemType } from "types";

interface CartListContextProps {
  cartList: CartItemType[];
  addToCart: (product: Product) => void;
}

const CartListContext = createContext<CartListContextProps | undefined>(undefined);

interface CartListProps {
  cartList: CartItemType[];
  addToCart: (product: Product) => void;
  children: ReactNode;
}

const CartList = ({ cartList, addToCart, children }: CartListProps): JSX.Element => {
  return (
    <CartListContext.Provider value={{ cartList, addToCart }}>
      <div>
        <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
        <div className="space-y-2">{children}</div>
      </div>
    </CartListContext.Provider>
  );
};

interface ProductListProps {
  children: ReactNode;
}

const ProductList = ({ children }: ProductListProps): JSX.Element => {
  return <>{children}</>;
};

interface ProductItemProps {
  product: Product;
}

const ProductItem = ({ product }: ProductItemProps): JSX.Element => {
  const { cartList, addToCart } = useContext(CartListContext)!;

  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };

  const getRemainingStock = (product: Product) => {
    const cartItem = cartList?.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  const remainingStock = getRemainingStock(product);

  return (
    <div key={product.id} data-testid={`product-${product.id}`} className="bg-white p-3 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{product.name}</span>
        <span className="text-gray-600">{product.price.toLocaleString()}원</span>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        <span className={`font-medium ${remainingStock > 0 ? "text-green-600" : "text-red-600"}`}>
          재고: {remainingStock}개
        </span>
        {product.discounts.length > 0 && (
          <span className="ml-2 font-medium text-blue-600">
            최대 {(getMaxDiscount(product.discounts) * 100).toFixed(0)}% 할인
          </span>
        )}
      </div>
      {product.discounts.length > 0 && (
        <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
          {product.discounts.map((discount, index) => (
            <li key={index}>
              {discount.quantity}개 이상: {(discount.rate * 100).toFixed(0)}% 할인
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => addToCart(product)}
        className={`w-full px-3 py-1 rounded ${remainingStock > 0 ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        disabled={remainingStock <= 0}
      >
        {remainingStock > 0 ? "장바구니에 추가" : "품절"}
      </button>
    </div>
  );
};

CartList.ProductList = ProductList;
CartList.ProductItem = ProductItem;

export default CartList;

import React, { useState } from 'react';

const PRODUCTS = [
  {
    id: 'p1',
    name: '상품1',
    price: 10_000,
    discountRate: 0.1,
    bulkDiscountRate: 0.25,
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20_000,
    discountRate: 0.15,
    bulkDiscountRate: 0.25,
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30_000,
    discountRate: 0.2,
    bulkDiscountRate: 0.25,
  },
];

const INIT_QUANTITY = 1;
const ADD_QUANTITY = 1;

export default function App() {
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [cartItemList, setCartItemList] = useState([]);

  function selectProduct(e) {
    setSelectedProductId(e.target.value);
  }

  function hasItemInCart(id) {
    return cartItemList.find((item) => item.id === id);
  }

  function addToCart() {
    if (hasItemInCart(selectedProductId)) {
      const newCartItemList = cartItemList.map((item) => {
        if (item.id === selectedProductId) item.quantity += ADD_QUANTITY;
        return item;
      });
      setCartItemList(newCartItemList);
      return;
    }

    const item = { id: selectedProductId, quantity: INIT_QUANTITY };

    setCartItemList((pre) => [...pre, item]);
  }

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" className="text-xl font-bold my-4"></div>
        <select
          onChange={selectProduct}
          id="product-select"
          className="border rounded p-2 mr-2"
        >
          {PRODUCTS.map((product) => (
            <option
              key={product.id}
              value={product.id}
            >{`${product.name} - ${product.price}원`}</option>
          ))}
        </select>
        <button
          onClick={addToCart}
          id="add-to-cart"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          추가
        </button>
      </div>
    </div>
  );
}

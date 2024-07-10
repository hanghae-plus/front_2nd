import React, { useCallback, useMemo, useState } from 'react';
import CartItem from './components/CartItem';

const PRODUCTS = [
  {
    id: 'p1',
    name: '상품1',
    price: 10_000,
    quantity: 0,
    discountRate: 0.1,
    bulkDiscountRate: 0.25,
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20_000,
    quantity: 0,
    discountRate: 0.15,
    bulkDiscountRate: 0.25,
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30_000,
    quantity: 0,
    discountRate: 0.2,
    bulkDiscountRate: 0.25,
  },
];

const ADD_QUANTITY = 1;

export default function App() {
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const selectProduct = useCallback(function (e) {
    setSelectedProductId(e.target.value);
  });

  const [cartItemList, setCartItemList] = useState([]);
  const hasItemInCart = useCallback(function (itemList, id) {
    return Boolean(itemList.find((item) => item.id === id));
  }, []);
  function addToCart(id = selectedProductId) {
    if (hasItemInCart(cartItemList, id)) {
      const newCartItemList = cartItemList.map((item) => {
        if (item.id === id) {
          item.quantity += ADD_QUANTITY;
        }
        return item;
      });
      return setCartItemList(newCartItemList);
    }

    const newCartItem = {
      ...PRODUCTS.find((product) => product.id === selectedProductId),
    };

    newCartItem.quantity += ADD_QUANTITY;
    setCartItemList((pre) => [...pre, newCartItem]);
  }

  const isOneItem = useCallback(function (id) {
    return cartItemList.find((item) => item.id === id).quantity === 1;
  }, []);
  const modifyCart = {
    plusItem(id) {
      addToCart(id);
    },
    minusItem(id) {
      if (!hasItemInCart(cartItemList, id)) {
        return;
      }
      if (isOneItem(id)) {
        modifyCart.deleteItem(id);
        return;
      }

      const newCartItemList = cartItemList.map((item) => {
        if (item.id === id) item.quantity -= ADD_QUANTITY;
        return item;
      });
      setCartItemList(newCartItemList);
    },

    deleteItem(id) {
      const newCartItemList = cartItemList
        .map((item) => {
          if (item.id === id) {
            item.quantity = 0;
          }
          return item;
        })
        .filter((item) => item.id !== id);
      setCartItemList(newCartItemList);
    },
  };

  // const [cartTotal, setCartTotal] = useState(0);
  const cartTotal = useMemo(() => {
    return cartItemList.reduce((pre, cur) => pre + cur.price * cur.quantity, 0);
  }, [cartItemList]);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {cartItemList.length > 0 &&
            cartItemList.map((item) => (
              <CartItem key={item.id} item={item} modifyCart={modifyCart} />
            ))}
        </div>
        {cartItemList.length > 0 && (
          <div
            id="cart-total"
            className="text-xl font-bold my-4"
          >{`총액: ${Math.round(cartTotal)}원`}</div>
        )}
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
          onClick={() => addToCart()}
          id="add-to-cart"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          추가
        </button>
      </div>
    </div>
  );
}

import React, { useCallback, useMemo, useState } from 'react';
import {
  ADD_QUANTITY,
  BULK_DISCOUNT_RATE,
  DEFAULT_DISCOUNT_RATE,
  DISCOUNT_QUANTITY,
  PRODUCTS,
} from './constants';
import { hasItemInCart, isBulk, isNeedDiscount } from './utils';
import { CartTotal, CartItem } from './components';
import {
  AddButton,
  Background,
  CartItemContainer,
  Option,
  Select,
  Title,
  WrapperBox,
} from './components/UI';

export default function App() {
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);

  const selectProduct = useCallback(function (e) {
    setSelectedProductId(e.target.value);
  }, []);

  const [cartItemList, setCartItemList] = useState([]);

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

  function modifyCart() {
    function plusItem(id) {
      addToCart(id);
    }

    function minusItem(id) {
      if (!hasItemInCart(cartItemList, id)) {
        return;
      }
      if (isOneItem(cartItemList, id)) {
        modifyCart.deleteItem(id);
        return;
      }
      const newCartItemList = cartItemList.map((item) => {
        if (item.id === id) item.quantity -= ADD_QUANTITY;
        return item;
      });
      setCartItemList(newCartItemList);
    }

    function deleteItem(id) {
      const newCartItemList = cartItemList
        .map((item) => {
          if (item.id === id) {
            item.quantity = 0;
          }
          return item;
        })
        .filter((item) => item.id !== id);
      setCartItemList(newCartItemList);
    }

    return { plusItem, minusItem, deleteItem };
  }

  const cartTotal = useMemo(() => {
    return cartItemList.reduce((pre, cur) => pre + cur.price * cur.quantity, 0);
  }, [cartItemList]);

  const discountRate = useMemo(() => {
    if (isBulk(cartItemList)) {
      return BULK_DISCOUNT_RATE;
    }
    if (isNeedDiscount(cartItemList)) {
      const discountedTotal = cartItemList.reduce((pre, cur) => {
        if (cur.quantity >= DISCOUNT_QUANTITY) {
          return pre + cur.quantity * cur.price * (1 - cur.discountRate);
        }
        return pre + cur.quantity * cur.price;
      }, 0);

      return (cartTotal - discountedTotal) / cartTotal;
    }
    return DEFAULT_DISCOUNT_RATE;
  }, [cartItemList]);

  return (
    <Background>
      <WrapperBox>
        <Title>장바구니</Title>
        <CartItemContainer>
          {cartItemList.length > 0 &&
            cartItemList.map((item) => (
              <CartItem key={item.id} item={item} modifyCart={modifyCart} />
            ))}
        </CartItemContainer>
        {cartItemList.length > 0 && (
          <CartTotal discountRate={discountRate} cartTotal={cartTotal} />
        )}
        <Select onChange={selectProduct}>
          {PRODUCTS.map((product) => (
            <Option key={product.id} product={product} />
          ))}
        </Select>
        <AddButton onClick={() => addToCart()}>추가</AddButton>
      </WrapperBox>
    </Background>
  );
}

import React, { useCallback, useState } from 'react';
import { ADD_QUANTITY, PRODUCTS } from './constants';
import { hasItemInCart } from './utils';
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
import { ItemListContext, SetItemListContext } from './contexts';

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

  return (
    <Background>
      <WrapperBox>
        <Title>장바구니</Title>
        <SetItemListContext.Provider value={setCartItemList}>
          <ItemListContext.Provider value={cartItemList}>
            <CartItemContainer>
              {cartItemList.length > 0 &&
                cartItemList.map((item) => (
                  <CartItem key={item.id} item={item} addToCart={addToCart} />
                ))}
            </CartItemContainer>
            {cartItemList.length > 0 && <CartTotal />}
            <Select onChange={selectProduct}>
              {PRODUCTS.map((product) => (
                <Option key={product.id} product={product} />
              ))}
            </Select>
            <AddButton onClick={() => addToCart()}>추가</AddButton>
          </ItemListContext.Provider>
        </SetItemListContext.Provider>
      </WrapperBox>
    </Background>
  );
}

import React, { useState } from "react";
import CartItem from "./CartItem";
import createProductOptions from "./ProductOptions";
import calculateTotalPrice from "../utils/calculateTotalPrice";
import PRODUCTS from "../store/products";

function Cart() {
  // 장바구니 목록을 저장하는 상태 변수
  const [cartItems, setCartItems] = useState([]);

  // '추가'버튼 클릭 시 호출되는 함수: 장바구니에 상품 추가 또는 수량 증가
  const addToCart = (productId) => {
    // productId를 이용해 PRODUCTS 배열에서 해당 상품을 찾음
    const product = PRODUCTS.find((p) => p.id === productId);

    // setCartItems를 통해 장바구니 목록 업데이트
    setCartItems((prevItems) => {
      // 장바구니에 이미 있는 상품인지 확인
      const isExist = prevItems.some((item) => item.id === productId);

      if (!isExist) {
        // 상품이 없으면 새로 추가
        return [...prevItems, { ...product, quantity: 1 }];

      } else {
        // 상품이 있으면 수량 1 증가
        return prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
    });
  };

  // '-' 버튼 클릭 시 호출되는 함수: 장바구니에 담긴 상품의 수량 1 감소, 수량이 0이면 장바구니에서 삭제
  const handleDecrease = (productItem) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === productItem.id
            ? item.quantity - 1 === 0
              ? null // 수량이 0이면 null 반환
              : { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item !== null) // null인 항목 제거
    );
  };

  // '+' 버튼 클릭 시 호출되는 함수: 장바구니에 담긴 상품의 수량 1 증가
  const handleIncrease = (productItem) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // '삭제' 버튼 클릭 시 호출되는 함수: 장바구니에서 해당 상품 삭제
  const handleRemove = (productItem) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productItem.id)
    );
  };

  // 장바구니 컴포넌트 렌더링
  return React.createElement(
    "div",
    {
      className:
        "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",
    },
    React.createElement(
      "h1",
      { className: "text-2xl font-bold mb-4" },
      "장바구니"
    ),
    React.createElement(
      "div",
      { id: "cart-items" },
      // 장바구니에 아이템이 있는지 확인하고, CartItem 컴포넌트 또는 메시지 렌더링
      cartItems.length > 0
        ? CartItem({
            items: cartItems,
            onIncrease: handleIncrease,
            onDecrease: handleDecrease,
            onRemove: handleRemove,
          })
        : "장바구니가 비어 있습니다."
    ),
    React.createElement(
      "div",
      { id: "cart-total", className: "text-xl font-bold my-4" },
      // 총액 계산하여 표시
      calculateTotalPrice(cartItems)
    ),
    React.createElement(
      "select",
      { id: "product-select", className: "border rounded p-2 mr-2" },
      // 상품 옵션 생성 및 렌더링
      createProductOptions()
    ),
    React.createElement(
      "button",
      {
        id: "add-to-cart",
        className: "bg-blue-500 text-white px-4 py-2 rounded",
        onClick: () => {
          // '추가' 버튼 클릭 시 선택된 상품을 장바구니에 추가
          const selectElement = document.getElementById("product-select");
          addToCart(selectElement.value);
        },
      },
      "추가"
    )
  );
}

export default Cart;

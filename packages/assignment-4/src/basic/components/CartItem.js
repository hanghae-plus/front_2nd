import React from "react";
import ButtonBox from "./ButtonBox";

// 장바구니에 추가된 상품을 렌더링하는 컴포넌트
function CartItem({ items, onIncrease, onDecrease, onRemove }) {
  // items 배열을 순회하며 각각의 상품을 렌더링
  return items.map((item, index) =>
    React.createElement(
      "div",
      { key: index, className: "flex justify-between items-center mb-2" },
      // 상품 이름, 가격, 수량을 표시
      React.createElement(
        "span",
        null,
        `${item.name} - ${item.price}원 x ${item.quantity}`
      ),
      // 각 상품에 대한 버튼 박스를 렌더링
      React.createElement(ButtonBox, {
        productId: item.id, // 상품 ID를 전달
        onDecrease: () => onDecrease(item), // 수량 감소 함수
        onIncrease: () => onIncrease(item), // 수량 증가 함수
        onRemove: () => onRemove(item), // 상품 제거 함수
      })
    )
  );
}

export default CartItem;

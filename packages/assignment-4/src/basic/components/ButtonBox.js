import React from "react";

// ButtonBox 컴포넌트: 상품 수량을 조절하고 삭제할 수 있는 버튼들을 포함
function ButtonBox({ productId, onDecrease, onIncrease, onRemove }) {
  return React.createElement(
    "div",
    null,
    // 수량 감소 버튼
    React.createElement(
      "button",
      {
        className: "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
        "data-change": "-1",
        "data-product-id": productId,
        onClick: onDecrease,
      },
      "-"
    ),
    // 수량 증가 버튼
    React.createElement(
      "button",
      {
        className: "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
        "data-change": "1",
        "data-product-id": productId,
        onClick: onIncrease,
      },
      "+"
    ),
    // 상품 삭제 버튼
    React.createElement(
      "button",
      {
        className: "remove-item bg-red-500 text-white px-2 py-1 rounded",
        "data-product-id": productId,
        onClick: onRemove,
      },
      "삭제"
    )
  );
}

export default ButtonBox;

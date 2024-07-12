import React from "react";
import PRODUCTS from "../store/products";

// 상품 옵션 생성 함수
function createProductOptions() {
  // PRODUCTS 배열을 순회하여 각 상품에 대한 <option> 요소를 생성
  return PRODUCTS.map((product) =>
    React.createElement(
      "option",
      { key: product.id, value: product.id },
      `${product.name} - ${product.price}원`
    )
  );
}

export default createProductOptions;

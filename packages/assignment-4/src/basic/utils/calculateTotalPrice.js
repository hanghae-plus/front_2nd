import React from "react";
import { DISCOUNT_THRESHOLDS, DISCOUNT_RATES } from "../store/constants";

// 장바구니에 담긴 상품의 총액을 계산하는 함수 (할인율 적용)
// 할인율과 임계값은 constants.js 파일에서 정의됨

function calculateTotalPrice(items) {
  // 장바구니에 상품이 없을 때 총액 반환
  if (items.length === 0) return "총액: 0원";

  // 장바구니에 상품이 있을 때 총 개수와 할인 전 총액 계산
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0); // 총 상품 개수
  const TotalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ); // 할인 전 총액
  let discountedTotalPrice = TotalPrice; // 할인 후 총액

  // 총 상품 개수가 BULK 임계값 이상일 경우 BULK 할인율 적용
  if (totalQuantity >= DISCOUNT_THRESHOLDS.BULK) {
    discountedTotalPrice *= 1 - DISCOUNT_RATES.BULK;
    return [
      `총액: ${Math.round(discountedTotalPrice)}원`,
      React.createElement(
        "span",
        { className: "text-green-500 ml-2" },
        `(${(DISCOUNT_RATES.BULK * 100).toFixed(1)}% 할인 적용)`
      ),
    ];
  } else {
    // 각 상품의 개수가 임계값 이상인 경우 해당 상품에 대해 개별 할인 적용
    discountedTotalPrice = items.reduce((acc, item) => {
      let itemTotalPrice = item.price * item.quantity;
      if (item.quantity >= DISCOUNT_THRESHOLDS[item.id]) {
        itemTotalPrice *= 1 - DISCOUNT_RATES[item.id];
      }
      return acc + itemTotalPrice;
    }, 0);

    // 할인율이 적용된 경우
    if (discountedTotalPrice !== TotalPrice) {
      return [
        `총액: ${Math.round(discountedTotalPrice)}원`,
        React.createElement(
          "span",
          { className: "text-green-500 ml-2" },
          `(${(
            ((TotalPrice - discountedTotalPrice) / TotalPrice) *
            100
          ).toFixed(1)}% 할인 적용)`
        ),
      ];
    }

    // 할인율이 적용되지 않은 경우
    return `총액: ${TotalPrice}원`;
  }
}

export default calculateTotalPrice;

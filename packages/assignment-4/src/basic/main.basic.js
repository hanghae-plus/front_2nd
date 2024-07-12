import firstView from "./main.basic.view";
import discountPrice from "./main.basic.discount.js";
import addCartFun from "./main.basic.addCart.js";
import cartQty from "./main.basic.cartQty.js";

function main() {
  // 1. 변수명 고치기 (너무 축약된거 풀어쓰기)
  // 2. data 다른 파일로 빼기
  // 3. 중복사항 함수로 만들기
  // 4. component나누기
  // 5. 함수 줄여보기..

  firstView();

  discountPrice();

  // 장바구니 물건의 할인율 구하는 함수
  addCartFun();

  cartQty();
}

main();

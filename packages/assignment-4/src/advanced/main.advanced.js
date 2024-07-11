const products = [
  { id: "p1", name: "상품1", price: 10000 },
  { id: "p2", name: "상품2", price: 20000 },
  { id: "p3", name: "상품3", price: 30000 },
];
import {
  ProductOption,
  MainLayout,
  CartItem,
  CartTotal,
} from "../templates.js";
import { createShoppingCart } from "../createShoppingCart.js";

const createCartView = () => {
  const app = document.getElementById("app");
  app.innerHTML = MainLayout({ items: products });

  // Add product options
  const $productSelect = document.getElementById("product-select");
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.innerHTML = ProductOption(product);
    $productSelect.appendChild(option);
  });
};
// DOM 초기화 및 메인 애플리케이션 초기화
function main() {
  createCartView(); // 장바구니 뷰 초기화
  const cart = createShoppingCart(); // 장바구니 객체 생성

  // 상품 추가 버튼 이벤트 리스너 설정
  const $productSelect = document.getElementById("product-select");
  const $addToCartButton = document.getElementById("add-to-cart");

  $addToCartButton.addEventListener("click", () => {
    const selectedProductId = $productSelect.value;
    const selectedProduct = products.find(
      (product) => product.id === selectedProductId
    );
    if (selectedProduct) {
      cart.addItem(selectedProduct); // 장바구니에 상품 추가
      updateCartView(); // 장바구니 뷰 업데이트
    }
  });

  // 장바구니 뷰 업데이트 함수
  const updateCartView = () => {
    const $cartItems = document.getElementById("cart-items");
    const $cartTotal = document.getElementById("cart-total");

    // 장바구니 내역 초기화
    $cartItems.innerHTML = "";

    // 장바구니 아이템들을 화면에 렌더링
    cart.getItems().forEach((item) => {
      const $item = document.createElement("div");
      $item.innerHTML = CartItem(item); // 각 상품에 대한 HTML 생성
      $cartItems.appendChild($item);
    });

    // 총액 및 할인 정보 업데이트
    const { total, discountRate } = cart.getTotal();
    $cartTotal.innerHTML = CartTotal({ total, discountRate });
  };

  // 초기 장바구니 뷰 업데이트
  updateCartView();
}

// 테스트 스크립트에서는 main 함수가 자동으로 호출됩니다.
export default main;

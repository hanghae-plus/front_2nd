import { createShoppingCart } from "./createShoppingCart";
import { CartTotal, CartItem, ProductOption, MainLayout } from "./templates";
import { PRODUCTS } from "./data";
//뷰 렌더링
const render = {
    //장바구니 뷰 생성
    createCartView: () => {
        const $app = document.querySelector("#app");
        $app.innerHTML = MainLayout();

        const $select = document.querySelector("#product-select");
        $select.innerHTML = ProductOption();
    },

    //장바구니 뷰 업데이트
    updateCartView: function (productId) {
        const { getTotal, getItemData } = createShoppingCart();
        const { name, price, quantity } = getItemData(productId);

        //수량이 1보다 작으면 삭제
        if (quantity <= 0) {
            this.removeItem(productId);
        }

        //타겟 유무로 Update or Add
        const $target = document.querySelector(`#${productId}`);

        $target
            ? ($target.querySelector(".product-info").textContent = `${name} - ${price}원 x ${quantity}`)
            : this.addItem(productId, quantity);

        //합계 렌더링
        const html = CartTotal(getTotal());
        const $cartTotal = document.querySelector(`#cart-total`);
        $cartTotal.innerHTML = html;

        console.log("PRODUCTS :", PRODUCTS);
    },

    //상품 추가
    addItem: (productId, quantity) => {
        if (quantity === 0) return;

        const $cart = document.querySelector("#cart-items");
        const $itemContainer = document.createElement("div");
        $itemContainer.id = productId;
        $itemContainer.className = "flex justify-between items-center mt-5 border-b-2 pb-2";
        $itemContainer.innerHTML = CartItem(productId);
        $cart.appendChild($itemContainer);
    },

    //상품 삭제 : 선택상품 삭제 후 수량 초기화
    removeItem: (productId) => {
        const $target = document.getElementById(productId);
        $target && $target.remove();
    },
};
export { render };

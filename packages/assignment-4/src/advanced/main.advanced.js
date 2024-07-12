import { render } from "./createCartView";
import { PRODUCTS } from "./data";
import { createShoppingCart } from "./createShoppingCart";

const { updateQuantity } = createShoppingCart();

//장바구니 상품별 버튼 클릭
const handleCartItemButtonClick = (event) => {
    const $target = event.target;
    const productId = $target.dataset.productId;

    switch (true) {
        case $target.classList.contains("remove-item"):
            updateQuantity("remove", productId);
            break;
        case $target.classList.contains("plus-item"):
            updateQuantity("plus", productId);
            break;
        case $target.classList.contains("minus-item"):
            updateQuantity("minus", productId);
            break;
    }

    render.updateCartView(productId);
};

//추가버튼 클릭
const handleAddClick = () => {
    const productId = document.querySelector("#product-select").value;
    const selectedProduct = PRODUCTS.find((item) => item.id === productId);

    if (!selectedProduct) return;

    //상품추가 or 업데이트
    const $cartItem = document.getElementById(productId);

    $cartItem ? updateQuantity("plus", productId) : updateQuantity("add", productId);

    render.updateCartView(productId);
};

function main() {
    render.createCartView();

    //추가버튼 이벤트 바인딩
    const $addBtn = document.querySelector("#add-to-cart");
    $addBtn.addEventListener("click", handleAddClick);

    //장바구니 상품별 버튼 이벤트 바인딩
    const $cartList = document.querySelector("#cart-items");
    $cartList.addEventListener("click", handleCartItemButtonClick);
}

main();

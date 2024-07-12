import { createShoppingCart } from "./createShoppingCart";
import { PRODUCTS } from "./data";
const { getItemData } = createShoppingCart();

//상품  Option  템플릿 리터럴
const ProductOption = (products = PRODUCTS) => {
    return products.map((item) => `<option value="${item.id}">${item.name} - ${item.price}원</option>`).join("");
};

//장바구니 레이아웃 템플릿 리터럴
const MainLayout = () => {
    return `<div class="bg-gray-100 p-8">
            <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
                <h1 class="text-2xl font-bold my-4">장바구니</h1>
                <div id="cart-items"></div>
                <div id="cart-total" class="text-xl font-bold my-4"></div>
                <select id="product-select" class="border rounded p-2 mr-2"></select>
                <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
            </div>
        </div>`;
};

//장바구니 아이템 템플릿 리터럴
function CartItem(productId) {
    const { name, price } = getItemData(productId);
    return `
        <span class="product-info">${name} - ${price}원 x 1</span>
        <div class="btn-wrap">
            <button
                class="minus-item quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                data-product-id="${productId}"
                >
                -
            </button>
            <button
                class="plus-item quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                data-product-id="${productId}"
                >
                +
            </button>
            <button
                class="remove-item bg-red-500 text-white px-2 py-1 rounded"
                data-product-id="${productId}"
                >
                삭제
            </button>
        </div>
	`;
}

//합계 리터럴
const CartTotal = (result) => {
    const { discountRate, total } = result;

    let htmlContent = `총액: ${Math.round(total)}원`;

    discountRate > 0 &&
        (htmlContent += `<span class="text-green-500 ml-2"> (${(discountRate * 100).toFixed(1)}% 할인 적용)</span>`);

    return htmlContent;
};

export { ProductOption, MainLayout, CartItem, CartTotal };

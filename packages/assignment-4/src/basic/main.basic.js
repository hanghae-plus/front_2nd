//상품 데이터
const products = [
    { id: "p1", name: "상품1", price: 10000 },
    { id: "p2", name: "상품2", price: 20000 },
    { id: "p3", name: "상품3", price: 30000 },
];

//** element 생성  **/
//전역 참조 elements
const { $cart, $cartTotal, $selectBox, $addButton } = createCartBaseElements();

//장바구니 기본요소 생성
function createCartBaseElements() {
    const container = document.getElementById("app");

    const htmlContent = `
        <div class="bg-gray-100 p-8">
            <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
                <h1 class="text-2xl font-bold my-4">장바구니</h1>
                <div id="cart-items"></div>
                <div id="cart-total" class="text-xl font-bold my-4"></div>
                <select id="product-select" class="border rounded p-2 mr-2"></select>
                <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
            </div>
        </div>
    `;

    container.innerHTML = htmlContent;

    const $cart = container.querySelector("#cart-items");
    const $cartTotal = container.querySelector("#cart-total");
    const $selectBox = container.querySelector("#product-select");
    const $addButton = container.querySelector("#add-to-cart");

    return { $cart, $cartTotal, $selectBox, $addButton };
}

//상품 옵션 생성
function createProductOptions($selectBox) {
    $selectBox.innerHTML = products
        .map((item) => `<option value="${item.id}">${item.name} - ${item.price}원</option>`)
        .join("");
}

//장바구니 목록 생성
function createCartItemElements(item) {
    const { name, id, price } = item;
    const $itemContainer = document.createElement("div");

    $itemContainer.id = id;
    $itemContainer.className = "flex justify-between items-center";

    //리터럴 템플릿으로 버튼을 생성합니다
    var htmlContent = `
        <span>${name} - ${price} x 1</span>
        <div>
            <button
                class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                data-product-id="${id}"
                data-change="-1">
                -
            </button>
            <button
                class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                data-product-id="${id}"
                data-change="1">
                +
            </button>
            <button
                class="remove-item bg-red-500 text-white px-2 py-1 rounded"
                data-product-id="${id}"
                data-change="remove">
                삭제
            </button>
        </div>
	`;

    $itemContainer.innerHTML = htmlContent;
    $cart.appendChild($itemContainer);
}

//** 데이터 계산 및 추출 로직  **/
//상품타입별 할인율 반환
function getDiscountRateByItemType(itemType) {
    switch (itemType) {
        case "p1":
            return 0.1;
        case "p2":
            return 0.15;
        case "p3":
            return 0.2;
    }
}

//텍스트에서 담긴상품정보 추출(상품정보, 담긴수량)
function getItemDataByText(targetText) {
    const itemInfo = targetText[0];
    const currentQuantity = parseInt(targetText[1]);
    return { itemInfo, currentQuantity };
}

//장바구니에 담긴 상품 계산
function calculateCartItems($cartItems) {
    let totalQuantity = 0;
    let totalOriginalPrice = 0;
    let totalDiscountedPrice = 0;

    Array.from($cartItems).forEach((item) => {
        const target = products.find((product) => product.id === item.id);
        const itemType = target.id;

        let quantity = parseInt(item.querySelector("span").textContent.split("x ")[1]);
        let calPrice = target.price * quantity;

        totalQuantity += quantity;
        totalOriginalPrice += calPrice;

        const discountRate = quantity >= 10 ? getDiscountRateByItemType(itemType) : 0;

        totalDiscountedPrice += calPrice * (1 - discountRate);
    });

    return { totalQuantity, totalDiscountedPrice, totalOriginalPrice };
}

//추가 할인 적용
function applyAdditionalDiscount(totalQuantity, totalDiscountPrice, totalOriginalPrice) {
    let discountRate = (totalOriginalPrice - totalDiscountPrice) / totalOriginalPrice;
    let finalPrice = totalDiscountPrice;

    // 30개 이상일 경우 높은 할인율 적용
    if (totalQuantity >= 30) {
        finalPrice = totalOriginalPrice * 0.75;
        discountRate = 0.25;
    }

    return { discountRate, finalPrice };
}

//** 화면 출력 로직  **/

//상품 수량 표시
function displayItemQuantity(targetElement, targetProduct) {
    const { name, price } = targetProduct;
    const quantity = parseInt(targetElement.querySelector("span").textContent.split("x ")[1]) + 1;
    targetElement.querySelector("span").textContent = `${name} - ${price}원 x ${quantity}`;
}

//최종 계산결과 표시
function displayCartResult(result) {
    const { discountRate, finalPrice } = result;

    let htmlContent = `총액: ${Math.round(finalPrice)}원`;

    discountRate > 0 &&
        (htmlContent += `<span class="text-green-500 ml-2"> (${(discountRate * 100).toFixed(1)}% 할인 적용)</span>`);
    $cartTotal.innerHTML = htmlContent;
}

//** 화면 수정 로직  **/
//장바구니에 상품 추가
function addCartItem() {
    var selectedValue = $selectBox.value;
    var targetProduct = products.find((product) => product.id === selectedValue);

    if (targetProduct) {
        const $cartItem = document.getElementById(targetProduct.id);
        $cartItem ? displayItemQuantity($cartItem, targetProduct) : createCartItemElements(targetProduct);
        updateCart();
    }
}

//장바구니 상품 관리
function manageCartItem(event) {
    const target = event.target;
    const isChangeButton = target.classList.contains("quantity-change");
    const isRemoveButton = target.classList.contains("remove-item");

    if (!isChangeButton && !isRemoveButton) return;

    const productId = target.dataset.productId;
    const $targetItem = document.getElementById(productId);

    if (isChangeButton) {
        const quantityChange = parseInt(target.dataset.change);
        const targetText = $targetItem.querySelector("span").textContent.split("x ");
        const { itemInfo, currentQuantity } = getItemDataByText(targetText);

        let itemQuantity = currentQuantity + quantityChange;

        itemQuantity <= 0
            ? $targetItem.remove()
            : ($targetItem.querySelector("span").textContent = `${itemInfo}x ${itemQuantity}`);
    }

    isRemoveButton && $targetItem.remove();

    updateCart();
}

//장바구니 업데이트
function updateCart() {
    const $cartItems = $cart.children;

    //장바구니에 담긴 상품 계산
    const { totalQuantity, totalDiscountedPrice, totalOriginalPrice } = calculateCartItems($cartItems);

    //추가할인 적용
    const result = applyAdditionalDiscount(totalQuantity, totalDiscountedPrice, totalOriginalPrice);

    //최종 계산결과 표시
    displayCartResult(result);
}

function main() {
    //상품 목록 Option 생성
    createProductOptions($selectBox);

    //추가버튼 클릭
    $addButton.addEventListener("click", addCartItem);

    //추가된 상품목록 내 버튼 클릭
    $cart.addEventListener("click", manageCartItem);
}

main();

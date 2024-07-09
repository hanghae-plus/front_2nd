// 상품 옵션 템플릿
export const ProductOption = (id, name, price) => `
    <option value="${id}">${name} - ${price.toLocaleString()}원</option>
`;

// 메인 레이아웃 템플릿
export const MainLayout = () => `
    <section class="bg-gray-100 p-8">
        <article class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
            <h1 class="text-2xl font-bold mb-4">장바구니</h1>
            <ul id="cart-items"></ul>
            <div id="cart-total" class="text-xl font-bold my-4"></div>
            <select id="product-select" class="border rounded p-2 mr-2"></select>
            <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>        
        </article>
    </section>
`;

// 상품 템플릿
export const CartItem = (select, getQuantityFunc, updatItemFunc, removeItemFunc) => {
    const cartItemString = `
    <li id="${select.id}" class="flex justify-between items-center mb-2" data-quantity="1">
        <span>${select.name} - ${select.price}원 x 1</span>
        <div>
            <button id="minus-btn" class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" type="button">-</button>
            <button id="plus-btn" class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" type="button">+</button>
            <button id="remove-btn" class="remove-item bg-red-500 text-white px-2 py-1 rounded" type="button"">삭제</button>        
        </div>
    </li>
    `
    const div = document.createElement('div');
    div.innerHTML = cartItemString
    const $item = div.firstElementChild;

    // 마이너스 버튼 이벤트 핸들러
    $item.querySelector('#minus-btn').addEventListener('click', () => {
        updatItemFunc(select.id, -1)
        const $span = document.createElement('span')
        $span.innerHTML = CartTotal(select, getQuantityFunc(select.id))
        $item.replaceChild($span, $item.firstElementChild)
    });

    // 플러스 버튼 이벤트 핸들러
    $item.querySelector('#plus-btn').addEventListener('click', () => {
        updatItemFunc(select.id, 1)
        const $span = document.createElement('span')
        $span.innerHTML = CartTotal(select, getQuantityFunc(select.id))
        $item.replaceChild($span, $item.firstElementChild)
    });

    // 삭제버튼 이벤트 핸들러
    $item.querySelector('#remove-btn').addEventListener('click', () => {
        removeItemFunc(select.id)
    });

    return $item;
}

// 총합 템플릿
export const CartTotal = (select, quantity) => `${select.name} - ${select.price}원 x ${quantity}`;

const DISCOUNT_THRESHOLDS = {
    BULK_QUANTITY: 30,
    BULK_RATE: 0.25,
    PRODUCT_QUANTITY: 10
};

const PRODUCT_DISCOUNTS = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2
};

const products = [
    { id: 'p1', name: '상품1', price: 10000 },
    { id: 'p2', name: '상품2', price: 20000 },
    { id: 'p3', name: '상품3', price: 30000 },
];


function createElementWithAttributes(tag, attributes = {}) {
    const element = document.createElement(tag);
    for (let key in attributes) {
        if (key === 'className') {
            element.className = attributes[key];
        } else if (key === 'textContent') {
            element.textContent = attributes[key];
        } else if (key === 'dataset') {
            for (let dataKey in attributes.dataset) {
                element.dataset[dataKey] = attributes.dataset[dataKey];
            }
        } else if (key.startsWith('on') && typeof attributes[key] === 'function') {
            const eventName = key.substring(2).toLowerCase();
            element.addEventListener(eventName, attributes[key]);
        } else {
            element.setAttribute(key, attributes[key]);
        }
    }
    return element;
}

function createProductOption(product) {
    return createElementWithAttributes('option', {
        value: product.id,
        textContent: `${product.name} - ${product.price}원`
    });
}

function main() {
    const app = document.getElementById('app');
    const appBody = createElementWithAttributes('div', { className: 'bg-gray-100 p-8' });
    const container = createElementWithAttributes('div', { className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8' });
    const containerTitle = createElementWithAttributes('h1', { className: 'text-2xl font-bold mb-4', textContent: '장바구니' });
    const cartItemsContainer = createElementWithAttributes('div', { id: 'cart-items' });
    const cartTotalPrice = createElementWithAttributes('div', { id: 'cart-total', className: 'text-xl font-bold my-4' });
    const productSelect = createElementWithAttributes('select', { id: 'product-select', className: 'border rounded p-2 mr-2' });
    products.forEach(product => productSelect.appendChild(createProductOption(product)));


    const addToCartButton = createElementWithAttributes('button', { id: 'add-to-cart', className: 'bg-blue-500 text-white px-4 py-2 rounded', textContent: '추가', onclick: addItemtoCart });

    // 요소를 컨테이너에 추가
    container.append(containerTitle, cartItemsContainer, cartTotalPrice, productSelect, addToCartButton);
    appBody.appendChild(container);
    app.appendChild(appBody);

    // 장바구니 총액을 업데이트하는 함수
    function updateCartTotal() {
        let total = 0;
        let totalQuantity = 0;
        const items = cartItemsContainer.children;
        let totalBeforeDiscount = 0;

        for (let i = 0; i < items.length; i++) {
            const itemElement = items[i];
            const product = products.find(p => p.id === itemElement.id);
            const quantity = parseInt(itemElement.querySelector('span').textContent.split(' x ')[1]);
            const itemTotal = product.price * quantity;
            let discount = 0;

            totalQuantity += quantity;
            totalBeforeDiscount += itemTotal;

            if (quantity >= 10) {
                if (product.id === 'p1') discount = 0.1;
                else if (product.id === 'p2') discount = 0.15;
                else if (product.id === 'p3') discount = 0.2;
            }

            total += itemTotal * (1 - discount);
        }

        let discountRate = 0;
        if (totalQuantity >= 30) {
            const bulkDiscount = totalBeforeDiscount * 0.25;
            const individualDiscount = totalBeforeDiscount - total;
            if (bulkDiscount > individualDiscount) {
                total = totalBeforeDiscount * 0.75;
                discountRate = 0.25;
            } else {
                discountRate = individualDiscount / totalBeforeDiscount;
            }
        } else {
            discountRate = (totalBeforeDiscount - total) / totalBeforeDiscount;
        }

        cartTotalPrice.textContent = '총액: ' + Math.round(total) + '원';
        if (discountRate > 0) {
            const discountSpan = document.createElement('span');
            discountSpan.className = 'text-green-500 ml-2';
            discountSpan.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
            cartTotalPrice.appendChild(discountSpan);
        }
    }

    // 장바구니에 아이템을 추가하는 함수
    function addItemtoCart() {
        const selectedProductId = productSelect.value;
        let selectedProduct;

        // 선택된 제품을 찾기
        for (let idx = 0; idx < products.length; idx++) {
            if (products[idx].id === selectedProductId) {
                selectedProduct = products[idx];
                break;
            }
        }

        if (selectedProduct) {
            const existingItem = document.getElementById(selectedProduct.id);

            if (existingItem) {
                // 이미 장바구니에 있는 경우 수량을 증가시킴
                const quantitySpan = existingItem.querySelector('span');
                const currentQuantity = parseInt(quantitySpan.textContent.split(' x ')[1]);
                quantitySpan.textContent = `${selectedProduct.name} - ${selectedProduct.price}원 x ${currentQuantity + 1}`;
                existingItem.dataset.quantity = currentQuantity + 1;
            } else {
                // 장바구니에 없는 경우 새로운 아이템을 추가
                const item = createElementWithAttributes('div', { id: selectedProduct.id, className: 'flex justify-between items-center mb-2', dataset: { quantity: '1' } });
                const itemInfo = createElementWithAttributes('span', { textContent: `${selectedProduct.name} - ${selectedProduct.price}원 x 1` });

                const minusBtn = createElementWithAttributes('button', {
                    className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
                    textContent: '-',
                    dataset: { productId: selectedProduct.id, change: '-1' }
                });
                const plusBtn = createElementWithAttributes('button', {
                    className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
                    textContent: '+',
                    dataset: { productId: selectedProduct.id, change: '1' }
                });
                const deleteBtn = createElementWithAttributes('button', {
                    className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
                    textContent: '삭제',
                    dataset: { productId: selectedProduct.id }
                });

                const itemBtns = createElementWithAttributes('div');
                itemBtns.append(minusBtn, plusBtn, deleteBtn);

                item.append(itemInfo, itemBtns);
                cartItemsContainer.appendChild(item);
            }
            updateCartTotal();
        }
    }

    // 장바구니 항목에서 수량을 변경하거나 항목을 제거하는 이벤트 핸들러
    cartItemsContainer.onclick = (event) => {
        if (event.target.classList.contains('quantity-change') || event.target.classList.contains('remove-item')) {
            const productId = event.target.dataset.productId;
            const item = document.getElementById(productId);

            if (event.target.classList.contains('quantity-change')) {
                const change = parseInt(event.target.dataset.change);
                const quantitySpan = item.querySelector('span');
                const currentQuantity = parseInt(quantitySpan.textContent.split(' x ')[1]);
                const newQuantity = currentQuantity + change;

                if (newQuantity > 0) {
                    quantitySpan.textContent = `${products.find(p => p.id === productId).name} - ${products.find(p => p.id === productId).price}원 x ${newQuantity}`;
                    item.dataset.quantity = newQuantity;
                } else {
                    item.remove();
                }
            } else if (event.target.classList.contains('remove-item')) {
                item.remove();
            }
            updateCartTotal();
        }
    };
}

main();

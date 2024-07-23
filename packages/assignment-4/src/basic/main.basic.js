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

function createQuantityButton(text, productId, change) {
    return createElementWithAttributes('button', {
        className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
        textContent: text,
        dataset: { productId, change: change.toString() }
    });
}

function createDeleteButton(productId) {
    return createElementWithAttributes('button', {
        className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
        textContent: '삭제',
        dataset: { productId }
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

    // 장바구니 추가 로직 부분
    const addToCartButton = createElementWithAttributes('button', {
        id: 'add-to-cart',
        className: 'bg-blue-500 text-white px-4 py-2 rounded',
        textContent: '추가',
        onclick: addItemToCart
    });

    function addItemToCart() {
        const selectedProductId = productSelect.value;
        const selectedProduct = products.find(product => product.id === selectedProductId);
    
        if (selectedProduct) {
            const existingItem = document.getElementById(selectedProduct.id);
            if (existingItem) {
                incrementExistingItem(existingItem, selectedProduct);
            } else {
                addNewItemToCart(selectedProduct);
            }
            updateCartTotal();
        }
    }

    function addNewItemToCart(product) {
        const newItem = createCartItem(product, 1);
        cartItemsContainer.appendChild(newItem);
    }

    function createCartItem(product, quantity) {
        const item = createElementWithAttributes('div', {
            id: product.id,
            className: 'flex justify-between items-center mb-2',
            dataset: { quantity: quantity.toString() }
        });
    
        const itemInfo = createElementWithAttributes('span', {
            textContent: `${product.name} - ${product.price}원 x ${quantity}`
        });
    
        const itemBtns = createElementWithAttributes('div');
        const minusBtn = createQuantityButton('-', product.id, -1)
        const plusBtn = createQuantityButton('+', product.id, 1)
        const deleteBtn = createDeleteButton(product.id)
        itemBtns.append(minusBtn, plusBtn, deleteBtn)
        item.append(itemInfo, itemBtns);
        return item;
    }

    function updateCartTotal() {
        const { total, discountRate } = calculateCartTotal();
        updateCartTotalDisplay(total, discountRate);
    }

    function calculateCartTotal() {
        let total = 0;
        let totalQuantity = 0;
        let totalBeforeDiscount = 0;
    
        Array.from(cartItemsContainer.children).forEach(itemElement => {
            const product = products.find(p => p.id === itemElement.id);
            const quantity = parseInt(itemElement.dataset.quantity);
            const itemTotal = product.price * quantity;
    
            totalQuantity += quantity;
            totalBeforeDiscount += itemTotal;
    
            const discount = calculateItemDiscount(product, quantity);
            total += itemTotal * (1 - discount);
        });
    
        const bulkDiscount = calculateBulkDiscount(totalQuantity, totalBeforeDiscount);
        if (bulkDiscount > (totalBeforeDiscount - total)) {
            total = totalBeforeDiscount * (1 - DISCOUNT_THRESHOLDS.BULK_RATE);
        }
    
        const discountRate = (totalBeforeDiscount - total) / totalBeforeDiscount;
        return { total, discountRate };
    }

    function calculateItemDiscount(product, quantity) {
        return quantity >= DISCOUNT_THRESHOLDS.PRODUCT_QUANTITY ? PRODUCT_DISCOUNTS[product.id] || 0 : 0;
    }

    function calculateBulkDiscount(totalQuantity, totalBeforeDiscount) {
        return totalQuantity >= DISCOUNT_THRESHOLDS.BULK_QUANTITY ? totalBeforeDiscount * DISCOUNT_THRESHOLDS.BULK_RATE : 0;
    }

    function updateCartTotalDisplay(total, discountRate) {
        cartTotalPrice.textContent = `총액: ${Math.round(total)}원`;
        if (discountRate > 0) {
            const discountSpan = createElementWithAttributes('span', {
                className: 'text-green-500 ml-2',
                textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`
            });
            cartTotalPrice.appendChild(discountSpan);
        }
    }

    function incrementExistingItem(item, product) {
        const quantitySpan = item.querySelector('span');
        const currentQuantity = parseInt(item.dataset.quantity);
        const newQuantity = currentQuantity + 1;
        quantitySpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
        item.dataset.quantity = newQuantity.toString();
    }

    // 요소를 컨테이너에 추가
    container.append(containerTitle, cartItemsContainer, cartTotalPrice, productSelect, addToCartButton);
    appBody.appendChild(container);
    app.appendChild(appBody);


    // 장바구니 항목에서 수량을 변경하거나 항목을 제거하는 이벤트 핸들러
    cartItemsContainer.onclick = handleCartItemAction;

    function handleCartItemAction(event) {
        if (event.target.classList.contains('quantity-change') || event.target.classList.contains('remove-item')) {
            const productId = event.target.dataset.productId;
            const item = document.getElementById(productId);
    
            if (event.target.classList.contains('quantity-change')) {
                updateItemQuantity(item, parseInt(event.target.dataset.change));
            } else if (event.target.classList.contains('remove-item')) {
                item.remove();
            }
            updateCartTotal();
        }
    }

    function updateItemQuantity(item, change) {
        const quantitySpan = item.querySelector('span');
        const currentQuantity = parseInt(item.dataset.quantity);
        const newQuantity = currentQuantity + change;
    
        if (newQuantity > 0) {
            const product = products.find(p => p.id === item.id);
            quantitySpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
            item.dataset.quantity = newQuantity.toString();
        } else {
            item.remove();
        }
    }
}

main();

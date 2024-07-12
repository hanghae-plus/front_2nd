import templates from './templates.js';
// 3. 렌더링과 관련된 코드 (createCartView)
export default function createCartView(cart, templates) {
    let cartItemsContainer;
    let cartTotalPrice;
    let productSelect;
  
    function render() {
        const app = document.getElementById('app');
        const appBody = templates.createElementWithAttributes('div', { className: 'bg-gray-100 p-8' });
        const container = templates.createElementWithAttributes('div', { className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8' });
        const containerTitle = templates.createElementWithAttributes('h1', { className: 'text-2xl font-bold mb-4', textContent: '장바구니' });
        
        cartItemsContainer = templates.createElementWithAttributes('div', { id: 'cart-items' });
        cartTotalPrice = templates.createElementWithAttributes('div', { id: 'cart-total', className: 'text-xl font-bold my-4' });
        
        productSelect = templates.createElementWithAttributes('select', { id: 'product-select', className: 'border rounded p-2 mr-2' });
        cart.products.forEach(product => productSelect.appendChild(templates.createProductOption(product)));
        
        const addToCartButton = templates.createElementWithAttributes('button', {
            id: 'add-to-cart',
            className: 'bg-blue-500 text-white px-4 py-2 rounded',
            textContent: '추가',
            onclick: handleAddToCart
        });
  
        container.append(containerTitle, cartItemsContainer, cartTotalPrice, productSelect, addToCartButton);
        appBody.appendChild(container);
        app.appendChild(appBody);
  
        updateCartItems();
        updateCartTotal();
    }
  
    function updateCartItems() {
        cartItemsContainer.innerHTML = '';
        cart.cartItems.forEach(item => {
            cartItemsContainer.appendChild(templates.createCartItem(item));
        });
    }
  
    function updateCartTotal() {
        const { total, discountRate } = cart.calculateTotal();
        cartTotalPrice.textContent = `총액: ${Math.round(total)}원`;
        if (discountRate > 0) {
            const discountSpan = templates.createElementWithAttributes('span', {
                className: 'text-green-500 ml-2',
                textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`
            });
            cartTotalPrice.appendChild(discountSpan);
        }
    }
  
    function handleAddToCart() {
        const selectedProductId = productSelect.value;
        cart.addItem(selectedProductId);
        updateCartItems();
        updateCartTotal();
    }
  
    function handleCartItemAction(event) {
        if (event.target.classList.contains('quantity-change') || event.target.classList.contains('remove-item')) {
            const productId = event.target.dataset.productId;
            
            if (event.target.classList.contains('quantity-change')) {
                cart.updateItemQuantity(productId, parseInt(event.target.dataset.change));
            } else if (event.target.classList.contains('remove-item')) {
                cart.removeItem(productId);
            }
            
            updateCartItems();
            updateCartTotal();
        }
    }
  
    return {
        render,
        handleCartItemAction
    };
  }
  

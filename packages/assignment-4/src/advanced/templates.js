// export const ProductOption = () => ``;

// export const MainLayout = () => ``;

// export const CartItem = () => ``;

// export const CartTotal = () => ``;
// 2. UI 템플릿을 다루는 코드 (templates)
const templates = {
    createElementWithAttributes(tag, attributes = {}) {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.substring(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else {
                element.setAttribute(key, value);
            }
        });
        return element;
    },
  
    createProductOption(product) {
        return this.createElementWithAttributes('option', {
            value: product.id,
            textContent: `${product.name} - ${product.price}원`
        });
    },
  
    createQuantityButton(text, productId, change) {
        return this.createElementWithAttributes('button', {
            className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
            textContent: text,
            dataset: { productId, change: change.toString() }
        });
    },
  
    createDeleteButton(productId) {
        return this.createElementWithAttributes('button', {
            className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
            textContent: '삭제',
            dataset: { productId }
        });
    },
  
    createCartItem(item) {
        const cartItem = this.createElementWithAttributes('div', {
            id: item.id,
            className: 'flex justify-between items-center mb-2',
            dataset: { quantity: item.quantity.toString() }
        });
  
        const itemInfo = this.createElementWithAttributes('span', {
            textContent: `${item.name} - ${item.price}원 x ${item.quantity}`
        });
  
        const itemBtns = this.createElementWithAttributes('div');
        const minusBtn = this.createQuantityButton('-', item.id, -1);
        const plusBtn = this.createQuantityButton('+', item.id, 1);
        const deleteBtn = this.createDeleteButton(item.id);
        itemBtns.append(minusBtn, plusBtn, deleteBtn);
  
        cartItem.append(itemInfo, itemBtns);
        return cartItem;
    }
  };


export default templates;
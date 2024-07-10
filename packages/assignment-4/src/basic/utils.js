export function makeProductItemInfoText({ name, price, quantity = 1 }) {
	return `${name} - ${price}원 x ${quantity}`;
}

// 함수의 인자가 3개 이상이라면 객체로 전달한다.
export function createHtmlElement({
	elementType,
	id = '',
	className = '',
	innerText = '',
	dataset = {},
}) {
	const element = document.createElement(elementType);

	element.setAttribute('id', id);
	element.setAttribute('class', className);
	element.textContent = innerText;

	for (const [key, value] of Object.entries(dataset)) {
		element.dataset[key] = value;
	}

	return element;
}

export function createProductOptionElement(product) {
	const optionElement = document.createElement('option');

	optionElement.value = product.id;
	optionElement.textContent = `${product.name} - ${product.price}원`;

	return optionElement;
}

export function createCartItemElement(product) {
	const cartItemWrapperElement = createHtmlElement({
		elementType: 'div',
		id: product.id,
		className: 'flex justify-between items-center mb-2',
	});

	const productNameElement = createHtmlElement({
		elementType: 'span',
		innerText: makeProductItemInfoText(product),
	});

	const buttonWrapperElement = createHtmlElement({ elementType: 'div' });

	const minusButtonElement = createHtmlElement({
		elementType: 'button',
		className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
		innerText: '-',
		dataset: {
			productId: product.id,
			change: '-1',
		},
	});

	const plusButtonElement = createHtmlElement({
		elementType: 'button',
		className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
		innerText: '+',
		dataset: {
			productId: product.id,
			change: '1',
		},
	});

	const removeButtonElement = createHtmlElement({
		elementType: 'button',
		className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
		innerText: '삭제',
		dataset: {
			productId: product.id,
		},
	});

	buttonWrapperElement.append(
		minusButtonElement,
		plusButtonElement,
		removeButtonElement,
	);

	cartItemWrapperElement.append(productNameElement, buttonWrapperElement);

	return cartItemWrapperElement;
}

export function updateCartItemTextContent({
	targetCartItemElement,
	targetProduct,
	quantity,
}) {
	targetCartItemElement.querySelector('span').textContent =
		makeProductItemInfoText({ ...targetProduct, quantity });
}

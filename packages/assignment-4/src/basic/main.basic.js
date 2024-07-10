import {
	createHtmlElement,
	createProductOptionElement,
	createCartItemElement,
	updateCartItemTextContent,
} from './utils';

const productList = [
	{ id: 'p1', name: '상품1', price: 10000 },
	{ id: 'p2', name: '상품2', price: 20000 },
	{ id: 'p3', name: '상품3', price: 30000 },
];

const productIdQuantityMap = new Map([
	['p1', 0],
	['p2', 0],
	['p3', 0],
]);

const productIdDiscountRateMap = new Map([
	['p1', 0.1],
	['p2', 0.15],
	['p3', 0.2],
]);

function getProductQuantity(productId) {
	return productIdQuantityMap.get(productId) ?? 0;
}

function getProductDiscountRate(productId) {
	return productIdDiscountRateMap.get(productId) ?? 0;
}

function computeTotalProductQuantity() {
	return productList.reduce(
		(acc, curr) => acc + getProductQuantity(curr.id),
		0,
	);
}

function updateProductQuantity(productId, quantityChange) {
	productIdQuantityMap.set(
		productId,
		Math.max(0, getProductQuantity(productId) + quantityChange),
	);
}

function computeDiscountRate(productId, baseCount = 10) {
	const productQuantity = getProductQuantity(productId);

	return productQuantity >= baseCount ? getProductDiscountRate(productId) : 0;
}

function computeTotalPrice() {
	return productList.reduce(
		(acc, { id, price }) => acc + price * getProductQuantity(id),
		0,
	);
}

function computeBill() {
	const totalProductQuantity = computeTotalProductQuantity();

	return productList.reduce(
		(acc, { id, price }) =>
			acc +
			price *
				getProductQuantity(id) *
				(1 - (totalProductQuantity >= 30 ? 0.25 : computeDiscountRate(id))),
		0,
	);
}

function removeProductFromCart(productId) {
	productIdQuantityMap.set(productId, 0);
}

function main() {
	// HTML element는 "-Element" postfix를 붙인다.
	const appElement = document.getElementById('app');

	const backgroundElement = createHtmlElement({
		elementType: 'div',
		className: 'bg-gray-100 p-8',
	});

	const containerElement = createHtmlElement({
		elementType: 'div',
		className:
			'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
	});

	const headerElement = createHtmlElement({
		elementType: 'h1',
		className: 'text-2xl font-bold mb-4',
		innerText: '장바구니',
	});

	const cartItemsElement = createHtmlElement({
		elementType: 'div',
		id: 'cart-items',
	});

	const cartTotalElement = createHtmlElement({
		elementType: 'div',
		id: 'cart-total',
		className: 'text-xl font-bold my-4 hidden',
	});

	const discountRateElement = createHtmlElement({
		elementType: 'span',
		className: 'text-green-500 ml-2',
	});

	const productSelectElement = createHtmlElement({
		elementType: 'select',
		id: 'product-select',
		className: 'border rounded p-2 mr-2',
	});

	const addToCartButtonElement = createHtmlElement({
		elementType: 'button',
		id: 'add-to-cart',
		className: 'bg-blue-500 text-white px-4 py-2 rounded',
		innerText: '추가',
	});

	function updateCartTotalInfo() {
		const totalProductQuantity = computeTotalProductQuantity();
		const totalPrice = computeTotalPrice();
		const bill = computeBill();

		const finalDiscountRate = (totalPrice - bill) / totalPrice;

		cartTotalElement.textContent = `총액: ${Math.round(bill)}원`;

		if (finalDiscountRate > 0) {
			discountRateElement.textContent = `(${(finalDiscountRate * 100).toFixed(1)}% 할인 적용)`;
			cartTotalElement.appendChild(discountRateElement);
		}

		totalProductQuantity > 0
			? cartTotalElement.classList.remove('hidden')
			: cartTotalElement.classList.add('hidden');
	}

	productList.forEach((product) => {
		productIdQuantityMap.set(product.id, 0);
	});

	productSelectElement.append(...productList.map(createProductOptionElement));

	containerElement.append(
		headerElement,
		cartItemsElement,
		cartTotalElement,
		productSelectElement,
		addToCartButtonElement,
	);

	backgroundElement.append(containerElement);

	appElement.append(backgroundElement);

	addToCartButtonElement.addEventListener('click', () => {
		const targetProduct = productList.find(
			(product) => product.id === productSelectElement.value,
		);

		const targetCartItemElement = cartItemsElement.querySelector(
			`#${targetProduct.id}`,
		);

		updateProductQuantity(targetProduct.id, 1);

		updateCartTotalInfo();

		if (!targetCartItemElement) {
			const cartItemElement = createCartItemElement(targetProduct);

			cartItemElement.addEventListener('click', function (event) {
				if (event.target.classList.contains('remove-item')) {
					removeProductFromCart(targetProduct.id);
					this.remove();
					updateCartTotalInfo();
					return;
				}

				if (event.target.classList.contains('quantity-change')) {
					updateProductQuantity(
						targetProduct.id,
						parseInt(event.target.dataset.change),
					);

					if (getProductQuantity(targetProduct.id) === 0) {
						removeProductFromCart(targetProduct.id);
						this.remove();
						updateCartTotalInfo();
						return;
					}

					updateCartItemTextContent({
						targetCartItemElement: this,
						targetProduct,
						quantity: productIdQuantityMap.get(targetProduct.id),
					});

					updateCartTotalInfo();
				}
			});

			cartItemsElement.append(cartItemElement);
			return;
		}

		updateCartItemTextContent({
			targetCartItemElement,
			targetProduct,
			quantity: productIdQuantityMap.get(targetProduct.id),
		});
	});
}

main();

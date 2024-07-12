export const createShoppingCart = () => {
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

	const getProductList = () => {
		return productList;
	};

	const getProductQuantity = (productId) => {
		return productIdQuantityMap.get(productId) ?? 0;
	};

	const getProductDiscountRate = (productId) => {
		return productIdDiscountRateMap.get(productId) ?? 0;
	};

	const addProduct = (itemId) => {
		updateProductQuantity(itemId, 1);
	};

	const removeProduct = (itemId) => {
		resetProductQuantity(itemId);
	};

	const updateProductQuantity = (productId, quantityChange) => {
		productIdQuantityMap.set(
			productId,
			Math.max(0, getProductQuantity(productId) + quantityChange),
		);
	};

	const resetProductQuantity = (productId) => {
		productIdQuantityMap.set(productId, 0);
	};

	const computeProductItemInfoText = (product, quantity = 1) => {
		return `${product['name']} - ${product['name']}원 x ${quantity}`;
	};

	const computeTotalProductQuantity = () => {
		return productList.reduce(
			(acc, curr) => acc + getProductQuantity(curr.id),
			0,
		);
	};

	const computeDiscountRate = (productId, baseCount = 10) => {
		const productQuantity = getProductQuantity(productId);

		return productQuantity >= baseCount ? getProductDiscountRate(productId) : 0;
	};

	const computeTotalPrice = () => {
		return productList.reduce(
			(acc, { id, price }) => acc + price * getProductQuantity(id),
			0,
		);
	};

	const computeBill = () => {
		const totalProductQuantity = computeTotalProductQuantity();

		return productList.reduce(
			(acc, { id, price }) =>
				acc +
				price *
					getProductQuantity(id) *
					(1 - (totalProductQuantity >= 30 ? 0.25 : computeDiscountRate(id))),
			0,
		);
	};

	const computeProductInfoText = (productId) => {
		const targetProduct = productList.find(({ id }) => productId === id);

		return computeProductItemInfoText(
			targetProduct,
			getProductQuantity(productId),
		);
	};

	const computeFinalDiscountRate = () => {
		const totalPrice = computeTotalPrice();
		const bill = computeBill();

		return (totalPrice - bill) / totalPrice;
	};

	return {
		getProductList,
		addProduct,
		removeProduct,
		computeProductItemInfoText,
		updateProductQuantity,
		computeProductInfoText,
		computeFinalDiscountRate,
	};
};

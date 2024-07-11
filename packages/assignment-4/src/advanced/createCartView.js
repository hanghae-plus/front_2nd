import { createShoppingCart } from './createShoppingCart';
import { CartItem } from './templates';

export const createCartView = () => {
	const {
		getProductList,
		addProduct,
		removeProduct,
		computeProductItemInfoText,
		updateProductQuantity,
		computeProductInfoText,
		computeFinalDiscountRate,
	} = createShoppingCart();

	const addCartItem = (cartItemsElement) => {
		//
	};

	const removeCartItem = () => {
		//
	};

	const updateCartTotalInfo =
		(cartTotalElement, discountRateElement) =>
		({ totalProductQuantity, totalPrice, bill }) => {
			const finalDiscountRate = (totalPrice - bill) / totalPrice;

			cartTotalElement.textContent = `총액: ${Math.round(bill)}원`;

			if (finalDiscountRate > 0) {
				discountRateElement.textContent = `(${(finalDiscountRate * 100).toFixed(1)}% 할인 적용)`;
				cartTotalElement.appendChild(discountRateElement);
			}

			totalProductQuantity > 0
				? cartTotalElement.classList.remove('hidden')
				: cartTotalElement.classList.add('hidden');
		};

	const updateCartItemTextContent = ({
		cartItemElement,
		product,
		quantity,
	}) => {
		cartItemElement.querySelector('span').textContent = makeProductItemInfoText(
			{ ...targetProduct, quantity },
		);
	};

	return {
		addCartItem,
		removeCartItem,
		updateCartTotalInfo,
		updateCartItemTextContent,
	};
};

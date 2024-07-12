import { PRODUCTS } from "./data";
import { BULK_DISCOUNT_RATE, DISCOUNT_THRESHOLD, BULK_DISCOUNT_THRESHOLD } from "./constants";

//데이터 핸들링
export const createShoppingCart = () => {
    //상품 수량 업데이트
    const updateQuantity = (updateType, productId) => {
        const selectedProduct = PRODUCTS.find((item) => item.id === productId);

        switch (updateType) {
            case "plus":
                selectedProduct.quantity++;
                break;
            case "minus":
                selectedProduct.quantity--;
                break;
            case "remove":
                selectedProduct.quantity = 0;
                break;
            case "add":
                selectedProduct.quantity = 1;
                break;
        }
    };

    //수량, 할인율 합계
    const getTotal = () => {
        let totalQuantity = 0;
        let originPriceTotal = 0;
        let discountPriceTotal = 0;

        PRODUCTS.forEach((item) => {
            const { id, price, quantity, discountRate } = item;

            originPriceTotal += quantity * price;

            switch (id) {
                case "p1":
                    discountPriceTotal +=
                        quantity >= DISCOUNT_THRESHOLD ? quantity * price * (1 - discountRate) : quantity * price;
                    break;
                case "p2":
                    discountPriceTotal +=
                        quantity >= DISCOUNT_THRESHOLD ? quantity * price * (1 - discountRate) : quantity * price;
                    break;
                case "p3":
                    discountPriceTotal +=
                        quantity >= DISCOUNT_THRESHOLD ? quantity * price * (1 - discountRate) : quantity * price;
                    break;
                default:
                    discountPriceTotal += quantity * price;
                    break;
            }

            totalQuantity += quantity;
        });

        // 30개 이상일 경우 고정 할인
        const bulkDiscountPrice = originPriceTotal * (1 - BULK_DISCOUNT_RATE);

        // 개별 할인과 고정 할인 중 더 저렴한 가격 선택
        discountPriceTotal =
            totalQuantity >= BULK_DISCOUNT_THRESHOLD
                ? Math.min(bulkDiscountPrice, discountPriceTotal)
                : discountPriceTotal;

        let discountRate = (originPriceTotal - discountPriceTotal) / originPriceTotal;

        return { total: discountPriceTotal, discountRate };
    };

    //상품 정보 가져오기
    const getItemData = (productId) => {
        const selectedProduct = PRODUCTS.find((item) => item.id === productId);
        const { name, price, quantity } = selectedProduct;

        return { name, price, quantity };
    };

    return {
        updateQuantity,
        getTotal,
        getItemData,
    };
};

// 상수 모음
import {
    BIGGER_BULK_DIS_RATE,
    BULK_DIS_RATE,
    DIS_COUNT,
    PRODUCT,
    TOTAL_DIS_COUNT
} from "../constants/constants.js";

// 상품리스트
import productList from "../data/product.js";


// 각 상품별 할인율 반환 함수
const calculateItemDis = (item, quantity) => {
    if (quantity >= DIS_COUNT) return  PRODUCT[item.id]
    return 0;
}

const findProductById = (productId) => {
    return productList.find(product => product.id === productId);
};

// 각 상품별 할인율 계산후 반환
export const calculateTotals = (items) => {
    return Object.values(items).reduce((totals, item) => {
        const product = findProductById(item.$item.id);
        const quantity = parseInt(item.$item.dataset.quantity);
        const itemTotal = product.price * quantity;
        const discountRate = calculateItemDis(product, quantity);

        return {
            totalAfterDis: totals.totalAfterDis + itemTotal * (1 - discountRate),
            totalQuantity: totals.totalQuantity + quantity,
            totalBeforeDis: totals.totalBeforeDis + itemTotal
        };
    }, { totalAfterDis: 0, totalQuantity: 0, totalBeforeDis: 0 });
};

// 총개수 할인율 계산 함수
export const  applyBulkDiscount = (totalAfterDis, totalBeforeDis, totalQuantity) => {
    let finalDisRate = 0;
    /*
    * 총 수량이 30개 이상일 경우
    * - 개별 상품 할인의 총합
    * - 전체 25% 할인
    * - 더 큰 할인을 제공하는쪽을 선택
    * */
    const calcFinalDis = (totalBeforeDis - totalAfterDis) / totalBeforeDis

    if (totalQuantity >= TOTAL_DIS_COUNT) {
        let bulkDis = totalAfterDis * BULK_DIS_RATE;
        let individualDis = totalBeforeDis - totalAfterDis;

        if (bulkDis > individualDis) {
            totalAfterDis = totalBeforeDis * BIGGER_BULK_DIS_RATE;
            finalDisRate = BULK_DIS_RATE;
        } else {
            finalDisRate = calcFinalDis;
        }
    } else {
        finalDisRate = calcFinalDis;
    }
    return { totalAfterDis, finalDisRate };
}


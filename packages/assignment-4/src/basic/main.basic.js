// 데이터는 따로 관리
import productList from "./data/product.js";
import {appOptions, discountOptions} from "./data/elOptions.js";

// 공통함수 uitls로 관리
import { createEl, appendChild } from "./utils/utils.js";

// 상수모음
import {
    BIGGER_BULK_DIS_RATE,
    BULK_DIS_RATE,
    DIS_COUNT,
    PRODUCT_ONE,
    PRODUCT_ONE_RATE,
    PRODUCT_THREE,
    PRODUCT_THREE_RATE,
    PRODUCT_TWO,
    PRODUCT_TWO_RATE, TOTAL_DIS_COUNT
} from "./constants/constants.js";

// item을 생성 및 관리 하기위한 class
import ItemClass from "./class/itemClass.js";


// 재사용 되는 함수 아님 -> 즉시실행함수로 불필요한 메모리할당 x, 실행된 이후 가비지 컬렉션으로 이동
(function () {
    // 초기 app랜더링 함수
    const firstRender = () => {
        // 옵션 생성 함수
        const createOption = () => {
            const optionList = []

            for(const product of productList){
                const $option = createEl(
                    'option',
                    {
                        value:product.id,
                        textContent: `${product.name} - ${product.price}원`
                    }
                );
                optionList.push($option)
            }

            return optionList
        }

        const $app = document.querySelector('#app');
        const $section = createEl('section', appOptions.section);
        const $cart = createEl('article', appOptions.cart);
        const $title = createEl('h1', appOptions.title);
        const $total = createEl('div', appOptions.total);
        const $cartItems = createEl('div', appOptions.cartItems);
        const $select = createEl('select', appOptions.select);
        const $addBtn = createEl('button', appOptions.addBtn);


        appendChild($cart, [$title, $cartItems, $total, $select, $addBtn])
        appendChild($section, $cart);
        appendChild($app, $section);
        appendChild($select, createOption())

        return { $addBtn, $select, $cartItems, $total }
    }
    const { $addBtn, $select, $cartItems, $total } = firstRender()

    // item Constructor를 담기위한 객체
    // Map 과 같은 자료구조를 사용하지 않은 이유 -> 코드가 불필요하게 장황해질수 있음
    let Item = {}

    // [ 카트 데이터 업데이트 ]
    const updateCart = () => {
        // 각 상품별 할인율 반환 함수
        function calculateItemDis(item, quantity) {
            let disRate = 0;
            // 10개이상 구매시 할인율 적용
            if (quantity >= DIS_COUNT) {
                if (item.id === PRODUCT_ONE) disRate = PRODUCT_ONE_RATE;
                else if (item.id === PRODUCT_TWO) disRate = PRODUCT_TWO_RATE;
                else if (item.id === PRODUCT_THREE) disRate = PRODUCT_THREE_RATE;
            }
            return disRate;
        }

        // 각 상품별 할인율 계산후 반환
        function calculateTotals(items) {
            let totalAfterDis = 0;
            let totalQuantity = 0;
            let totalBeforeDis = 0;

            for (let key of Object.keys(items)) {
                const item = productList.find(val => val.id === items[key].$item.id);
                const quantity = parseInt(items[key].$item.dataset.quantity);
                const total = item.price * quantity;
                const disRate = calculateItemDis(item, quantity);

                totalQuantity += quantity;
                totalBeforeDis += total;
                totalAfterDis += total * (1 - disRate);
            }

            return { totalAfterDis, totalQuantity, totalBeforeDis };
        }

        function applyBulkDiscount(totalAfterDis, totalBeforeDis, totalQuantity) {
            let finalDisRate = 0;
            /*
            * 총 수량이 30개 이상일 경우
            * - 개별 상품 할인의 총합
            * - 전체 25% 할인
            * - 더 큰 할인을 제공하는쪽을 선택
            * */
            if (totalQuantity >= TOTAL_DIS_COUNT) {
                let bulkDis = totalAfterDis * BULK_DIS_RATE;
                let individualDis = totalBeforeDis - totalAfterDis;
                if (bulkDis > individualDis) {
                    totalAfterDis = totalBeforeDis * BIGGER_BULK_DIS_RATE;
                    finalDisRate = BULK_DIS_RATE;
                } else {
                    finalDisRate = (totalBeforeDis - totalAfterDis) / totalBeforeDis;
                }
            } else {
                finalDisRate = (totalBeforeDis - totalAfterDis) / totalBeforeDis;
            }
            return { totalAfterDis, finalDisRate };
        }

        // 할인율 Dom에 표현함수
        function updateTotalDisplay(totalAfterDis, finalDisRate) {
            $total.textContent = `총액: ${Math.round(totalAfterDis)}원`;
            if (finalDisRate > 0) {
                const $discount = createEl('span', {
                    ...discountOptions,
                    textContent: `(${(finalDisRate * 100).toFixed(1)}% 할인 적용)`
                });
                appendChild($total, $discount);
            }
        }

        const { totalAfterDis, totalQuantity, totalBeforeDis } = calculateTotals(Item);
        const { totalAfterDis: finalTotal, finalDisRate } = applyBulkDiscount(totalAfterDis, totalBeforeDis, totalQuantity);
        updateTotalDisplay(finalTotal, finalDisRate);
    }



    // [ 추가버튼 클릭함수 ]
    $addBtn.onclick = function() {
        const select = productList.find(product => product.id === $select.value);
        if (!select) return

        const $item = document.getElementById(select.id);

        // 선택된 아이템이 카트에 있을때
        if ($item) {
            Item[select.id].setItemQuantity(1)
            Item[select.id].setSpanText(select)
        }

        // 선택된 아이템이 카트에 없을때
        if(!$item){
            Item[select.id] = new ItemClass()
            Item[select.id].createItem(select)
            Item[select.id].handleClickMinusBtn(updateCart, Item)
            Item[select.id].handleClickPlusBtn(updateCart)
            Item[select.id].handleClickRemoveBtn(updateCart, Item)
            appendChild($cartItems, Item[select.id].$item);
        }

        updateCart();
    };
})()
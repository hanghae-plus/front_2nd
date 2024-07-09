// 데이터
import productList from "../basic/data/product.js";
// 템플릿
import {MainLayout, ProductOption, CartTotal} from "./templates.js";

import {createShoppingCart} from './createShoppingCart.js'




function main() {
    const { addItem, getItem, updateQuantity, getQuantity } =  createShoppingCart()


    // [ 초기 랜더링 ]
    const firstRender = () => {
        // mainLayout 생성
        const $app = document.querySelector('#app');
        const $mainLayout  = MainLayout()
        $app.innerHTML = $mainLayout

        // selectbox 생성
        const $select = document.querySelector('#product-select');
        const createOption = ($select) => {
            let options = ''

            for(const product of productList){
                options += ProductOption(product.id, product.name, product.price)
            }

            $select.innerHTML = options
        }
        createOption($select)
        return $select
    }
    const $select = firstRender()


    const $addCartBtn = document.querySelector('#add-to-cart');
    const $cartItems = document.querySelector('#cart-items')

    // [ 추가버튼 클릭 로직 ]
    $addCartBtn.onclick = () => {
        const select = productList.find(product => product.id === $select.value);
        if (!select) return

        const $item = document.querySelector(`#${select.id}`);

        // 선택된 아이템이 카트에 있을때
        if($item) {
            updateQuantity(select.id, 1)
            const $span = document.createElement('span')
            $span.innerHTML = CartTotal(select, getQuantity(select.id))
            $item.replaceChild($span, $item.firstElementChild)
        }

        // 선택된 아이템이 카트에 없을때
        if(!$item){
            addItem(select)
            $cartItems.appendChild(getItem(select.id))
        }
    }
}

main();

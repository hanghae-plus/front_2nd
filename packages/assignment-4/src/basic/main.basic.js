// 데이터는 따로 관리
import productList from './data/api.js'
import { appOptions, discountOptions } from './data/elOptions.js'

// 공통함수 uitls로 관리
import { createEl, appendChild } from './utils/render.js'

// item을 생성 및 관리 하기위한 class
import ItemClass from './class/itemClass.js'

// 할인율 계산 을 위한 함수들
import {
  calculateTotals,
  applyBulkDiscount,
} from './service/discountService.js'

// 재사용 되는 함수 아님 -> 즉시실행함수로 불필요한 메모리할당 x, 실행된 이후 가비지 컬렉션으로 이동
;(function () {
  // 초기 app랜더링 함수
  const firstRender = () => {
    // 옵션 생성 함수
    const createOption = () => {
      const optionList = []

      for (const product of productList) {
        const $option = createEl('option', {
          value: product.id,
          textContent: `${product.name} - ${product.price}원`,
        })
        optionList.push($option)
      }

      return optionList
    }

    const $app = document.querySelector('#app')
    const $section = createEl('section', appOptions.section)
    const $cart = createEl('article', appOptions.cart)
    const $title = createEl('h1', appOptions.title)
    const $total = createEl('div', appOptions.total)
    const $cartItems = createEl('div', appOptions.cartItems)
    const $select = createEl('select', appOptions.select)
    const $addBtn = createEl('button', appOptions.addBtn)

    appendChild($cart, [$title, $cartItems, $total, $select, $addBtn])
    appendChild($section, $cart)
    appendChild($app, $section)
    appendChild($select, createOption())

    return { $addBtn, $select, $cartItems, $total }
  }
  const { $addBtn, $select, $cartItems, $total } = firstRender()

  // item Constructor를 담기위한 객체
  // Map 과 같은 자료구조를 사용하지 않은 이유 -> 코드가 불필요하게 장황해질수 있음
  let Item = {}

  // [ 카트 데이터 업데이트 ]
  const updateCart = () => {
    // 할인율 Dom에 표현함수
    function updateTotalDisplay(totalAfterDis, finalDisRate) {
      $total.textContent = `총액: ${Math.round(totalAfterDis)}원`
      if (finalDisRate > 0) {
        const text = `(${(finalDisRate * 100).toFixed(1)}% 할인 적용)`
        const $discount = createEl('span', {
          ...discountOptions,
          textContent: text,
        })
        appendChild($total, $discount)
      }
    }

    const { totalAfterDis, totalQuantity, totalBeforeDis } =
      calculateTotals(Item)
    const { totalAfterDis: finalTotal, finalDisRate } = applyBulkDiscount(
      totalAfterDis,
      totalBeforeDis,
      totalQuantity,
    )
    updateTotalDisplay(finalTotal, finalDisRate)
  }

  // [ 추가버튼 클릭함수 ]
  $addBtn.onclick = function () {
    const select = productList.find((product) => product.id === $select.value)
    if (!select) return

    const $item = document.getElementById(select.id)

    // 선택된 아이템이 카트에 있을때
    if ($item) {
      Item[select.id].setItemQuantity(1)
      Item[select.id].setSpanText(select)
    }

    // 선택된 아이템이 카트에 없을때
    if (!$item) {
      Item[select.id] = new ItemClass()
      Item[select.id].createItem(select)
      Item[select.id].handleClickMinusBtn(updateCart, Item)
      Item[select.id].handleClickPlusBtn(updateCart)
      Item[select.id].handleClickRemoveBtn(updateCart, Item)
      appendChild($cartItems, Item[select.id].$item)
    }

    updateCart()
  }
})()

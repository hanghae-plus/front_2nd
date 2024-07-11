const itemList = [
  { id: 'p1', name: '상품1', price: 10000 },
  { id: 'p2', name: '상품2', price: 20000 },
  { id: 'p3', name: '상품3', price: 30000 },
];

function main() {
  const appElement = document.getElementById('app');
  const containerElement = document.createElement('div');
  const cardElement = document.createElement('div');
  const titleElement = document.createElement('h1');
  const selectedItemsElement = document.createElement('div');
  const totalPriceElement = document.createElement('div');
  const selectorElement = document.createElement('select');
  const addButtonElement = document.createElement('button');

  selectedItemsElement.id = 'cart-items';
  totalPriceElement.id = 'cart-total';
  selectorElement.id = 'product-select';
  addButtonElement.id = 'add-to-cart';
  containerElement.className = 'bg-gray-100 p-8';
  cardElement.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  titleElement.className = 'text-2xl font-bold mb-4';
  totalPriceElement.className = 'text-xl font-bold my-4';
  selectorElement.className = 'border rounded p-2 mr-2';
  addButtonElement.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  titleElement.textContent = '장바구니';
  addButtonElement.textContent = '추가';

  cardElement.appendChild(titleElement);
  cardElement.appendChild(selectedItemsElement);
  cardElement.appendChild(totalPriceElement);
  cardElement.appendChild(selectorElement);
  cardElement.appendChild(addButtonElement);
  containerElement.appendChild(cardElement);
  appElement.appendChild(containerElement);

  for (let i = 0; i < itemList.length; i++) {
    const itemOptionElement = document.createElement('option');
    itemOptionElement.value = itemList[i].id;
    itemOptionElement.textContent = itemList[i].name + ' - ' + itemList[i].price + '원';
    selectorElement.appendChild(itemOptionElement);
  }

  function updateCart() {
    let totalQuantity = 0;
    let originalPrice = 0;
    let finalPrice = 0;
    const selectedItemElementList = selectedItemsElement.children;

    for (let m = 0; m < selectedItemElementList.length; m++) {
      let item;
      for (let n = 0; n < itemList.length; n++) {
        if (itemList[n].id === selectedItemElementList[m].id) {
          item = itemList[n];
          break;
        }
      }
      const quantity = parseInt(selectedItemElementList[m].querySelector('span').textContent.split('x ')[1]);
      const totalPrice = item.price * quantity;
      let discountRatio = 0;

      totalQuantity += quantity;
      originalPrice += totalPrice;
      if (quantity >= 10) {
        if (item.id === 'p1') discountRatio = 0.1;
        else if (item.id === 'p2') discountRatio = 0.15;
        else if (item.id === 'p3') discountRatio = 0.2;
      }
      finalPrice += totalPrice * (1 - discountRatio);
    }

    let finalDiscountRatio = 0;
    if (totalQuantity >= 30) {
      // 총 갯수 30개 이상 시 25% 할인
      const bulkDiscount = finalPrice * 0.25;
      const individualDiscount = originalPrice - finalPrice;
      if (bulkDiscount > individualDiscount) {
        // 기존 할인율이 25%보다 작은 경우
        finalPrice = originalPrice * 0.75;
        finalDiscountRatio = 0.25;
      } else {
        // 기존 할인율이 25% 이상인 경우
        finalDiscountRatio = (originalPrice - finalPrice) / originalPrice;
      }
    } else {
      // 총 갯수 30개 미만
      finalDiscountRatio = (originalPrice - finalPrice) / originalPrice;
    }

    totalPriceElement.textContent = '총액: ' + Math.round(finalPrice) + '원';
    if (finalDiscountRatio > 0) {
      let discountElement = document.createElement('span');
      discountElement.className = 'text-green-500 ml-2';
      discountElement.textContent = '(' + (finalDiscountRatio * 100).toFixed(1) + '% 할인 적용)';
      totalPriceElement.appendChild(discountElement);
    }
  }

  // 추가 버튼 클릭 시 동작 함수
  addButtonElement.onclick = function () {
    let selectedItem;
    for (let k = 0; k < itemList.length; k++) {
      if (itemList[k].id === selectorElement.value) {
        selectedItem = itemList[k];
        break;
      }
    }
    if (selectedItem) {
      // 추가하려는 값이 itemList에 있는 경우
      const selectedItemElement = document.getElementById(selectedItem.id);
      if (selectedItemElement) {
        // 기존에 추가되어있는 값의 경우
        const updatedQuantity = parseInt(selectedItemElement.querySelector('span').textContent.split('x ')[1]) + 1;
        selectedItemElement.querySelector('span').textContent =
          selectedItem.name + ' - ' + selectedItem.price + '원 x ' + updatedQuantity;
      } else {
        // 새로 추가되는 값의 경우
        const selectedItemContainerElement = document.createElement('div');
        const selectedItemInfoElement = document.createElement('span');
        const buttonContainerElement = document.createElement('div');
        const decreaseButtonElement = document.createElement('button');
        const increaseButtonElement = document.createElement('button');
        const removeButtonElement = document.createElement('button');
        selectedItemContainerElement.id = selectedItem.id;
        selectedItemContainerElement.className = 'flex justify-between items-center mb-2';
        selectedItemInfoElement.textContent = selectedItem.name + ' - ' + selectedItem.price + '원 x 1';
        decreaseButtonElement.className = 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        decreaseButtonElement.textContent = '-';
        decreaseButtonElement.dataset.productId = selectedItem.id;
        decreaseButtonElement.dataset.change = '-1';
        increaseButtonElement.className = 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        increaseButtonElement.textContent = '+';
        increaseButtonElement.dataset.productId = selectedItem.id;
        increaseButtonElement.dataset.change = '1';
        removeButtonElement.className = 'remove-item bg-red-500 text-white px-2 py-1 rounded';
        removeButtonElement.textContent = '삭제';
        removeButtonElement.dataset.productId = selectedItem.id;
        buttonContainerElement.appendChild(decreaseButtonElement);
        buttonContainerElement.appendChild(increaseButtonElement);
        buttonContainerElement.appendChild(removeButtonElement);
        selectedItemContainerElement.appendChild(selectedItemInfoElement);
        selectedItemContainerElement.appendChild(buttonContainerElement);
        selectedItemsElement.appendChild(selectedItemContainerElement);
      }
      updateCart();
    }
  };

  selectedItemsElement.onclick = function (event) {
    // 수량 변경 및 제거 버튼 클릭 시 동작 함수
    const target = event.target;
    if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
      let productId = target.dataset.productId;
      let item = document.getElementById(productId);
      if (target.classList.contains('quantity-change')) {
        let change = parseInt(target.dataset.change);
        let quantity = parseInt(item.querySelector('span').textContent.split('x ')[1]) + change;
        if (quantity > 0) {
          item.querySelector('span').textContent =
            item.querySelector('span').textContent.split('x ')[0] + 'x ' + quantity;
        } else {
          item.remove();
        }
      } else if (target.classList.contains('remove-item')) {
        item.remove();
      }
      updateCart();
    }
  };
}

main();

function main() {
  const itemData = [
    { id: 'p1', n: '상품1', p: 10000 },
    { id: 'p2', n: '상품2', p: 20000 },
    { id: 'p3', n: '상품3', p: 30000 },
  ];
  const cartData = {};

  const app = document.getElementById('app');
  const wrapper = insertHtml(
    app,
    createElement({
      tag: 'div',
      class: 'bg-gray-100 p-8',
    })
  );
  const box = insertHtml(
    wrapper,
    createElement({
      tag: 'div',
      class:
        'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
    })
  );
  const cartTitle = insertHtml(
    box,
    createElement({
      tag: 'h1',
      class: 'text-2xl font-bold mb-4',
      text: '장바구니',
    })
  );
  const cartItem = insertHtml(
    box,
    createElement({
      tag: 'div',
      id: 'cart-items',
    })
  );
  const cartTotal = insertHtml(
    box,
    createElement({
      tag: 'div',
      id: 'cart-total',
      class: 'text-xl font-bold my-4',
    })
  );
  const selectProduct = insertHtml(
    box,
    createElement({
      tag: 'select',
      id: 'product-select',
      class: 'border rounded p-2 mr-2',
    })
  );
  const buttonAdd = insertHtml(
    box,
    createElement({
      tag: 'button',
      id: 'add-to-cart',
      class: 'bg-blue-500 text-white px-4 py-2 rounded',
      text: '추가',
    })
  );

  for (var j = 0; j < itemData.length; j++) {
    insertHtml(
      selectProduct,
      createElement({
        tag: 'option',
        value: itemData[j].id,
        text: itemData[j].n + ' - ' + itemData[j].p + '원',
      })
    );
  }

  function insertHtml(target, html, position = 'beforeend') {
    target.insertAdjacentHTML(position, html);
    return target.lastChild;
  }

  function createElement(nodeInfo) {
    const { tag, text, ...attrArray } = nodeInfo;
    const attributes = Object.entries(attrArray)
      .map(([attr, value]) => `${attr}="${value}"`)
      .join(' ');

    const element = `<${tag}${attributes ? ' ' + attributes : ''}>${
      text ? text : ''
    }</tag>`;
    return element;
  }

  function uc() {
    var t = 0;
    var tq = 0;
    var items = cartItem.children;
    var tb = 0;

    for (var m = 0; m < items.length; m++) {
      var item;
      for (var n = 0; n < itemData.length; n++) {
        if (itemData[n].id === items[m].id) {
          item = itemData[n];
          break;
        }
      }
      var quantity = parseInt(
        items[m].querySelector('span').textContent.split('x ')[1]
      );
      var itemTotal = item.p * quantity;
      var disc = 0;

      tq += quantity;
      tb += itemTotal;
      if (quantity >= 10) {
        if (item.id === 'p1') disc = 0.1;
        else if (item.id === 'p2') disc = 0.15;
        else if (item.id === 'p3') disc = 0.2;
      }
      t += itemTotal * (1 - disc);
    }

    var dr = 0;
    if (tq >= 30) {
      var bulkDiscount = t * 0.25;
      var individualDiscount = tb - t;
      if (bulkDiscount > individualDiscount) {
        t = tb * 0.75;
        dr = 0.25;
      } else {
        dr = (tb - t) / tb;
      }
    } else {
      dr = (tb - t) / tb;
    }

    cartTotal.textContent = '총액: ' + Math.round(t) + '원';
    if (dr > 0) {
      var dspan = document.createElement('span');
      dspan.className = 'text-green-500 ml-2';
      dspan.textContent = '(' + (dr * 100).toFixed(1) + '% 할인 적용)';
      cartTotal.appendChild(dspan);
    }
  }

  buttonAdd.onclick = function () {
    var v = selectProduct.value;
    var i;
    for (var k = 0; k < itemData.length; k++) {
      if (itemData[k].id === v) {
        i = itemData[k];
        break;
      }
    }
    if (i) {
      // console.log(i);
      var e = document.getElementById(i.id);
      if (e) {
        var q =
          parseInt(e.querySelector('span').textContent.split('x ')[1]) + 1;
        e.querySelector('span').textContent = i.n + ' - ' + i.p + '원 x ' + q;
      } else {
        var d = document.createElement('div');
        var sp = document.createElement('span');
        var bd = document.createElement('div');
        var mb = document.createElement('button');
        var pb = document.createElement('button');
        var rb = document.createElement('button');
        d.id = i.id;
        d.className = 'flex justify-between items-center mb-2';
        sp.textContent = i.n + ' - ' + i.p + '원 x 1';
        mb.className =
          'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        mb.textContent = '-';
        mb.dataset.productId = i.id;
        mb.dataset.change = '-1';
        pb.className =
          'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        pb.textContent = '+';
        pb.dataset.productId = i.id;
        pb.dataset.change = '1';
        rb.className = 'remove-item bg-red-500 text-white px-2 py-1 rounded';
        rb.textContent = '삭제';
        rb.dataset.productId = i.id;
        bd.appendChild(mb);
        bd.appendChild(pb);
        bd.appendChild(rb);
        d.appendChild(sp);
        d.appendChild(bd);
        cartItem.appendChild(d);
      }
      uc();
    }
  };

  cartItem.onclick = function (event) {
    var target = event.target;
    if (
      target.classList.contains('quantity-change') ||
      target.classList.contains('remove-item')
    ) {
      var productId = target.dataset.productId;
      var item = document.getElementById(productId);
      if (target.classList.contains('quantity-change')) {
        var change = parseInt(target.dataset.change);
        var quantity =
          parseInt(item.querySelector('span').textContent.split('x ')[1]) +
          change;
        if (quantity > 0) {
          item.querySelector('span').textContent =
            item.querySelector('span').textContent.split('x ')[0] +
            'x ' +
            quantity;
        } else {
          item.remove();
        }
      } else if (target.classList.contains('remove-item')) {
        item.remove();
      }
      uc();
    }
  };
}

main();

function main() {
  var PRODUCT = [
    { id: 'p1', n: '상품1', p: 10000 },
    { id: 'p2', n: '상품2', p: 20000 },
    { id: 'p3', n: '상품3', p: 30000 },
  ];

  var a = document.getElementById('app'); // app
  var w = document.createElement('div'); // background
  var b = document.createElement('div'); // container
  var h = document.createElement('h1'); // title
  var cartItems = document.createElement('div'); // cartItems
  var tt = document.createElement('div'); // cartTotal

  var select = document.createElement('select'); // select
  var addButton = document.createElement('button'); // button

  w.className = 'bg-gray-100 p-8';
  b.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  h.className = 'text-2xl font-bold mb-4';
  h.textContent = '장바구니';
  cartItems.id = 'cart-items';
  tt.id = 'cart-total';
  tt.className = 'text-xl font-bold my-4';
  select.id = 'product-select';
  select.className = 'border rounded p-2 mr-2';
  addButton.id = 'add-to-cart';
  addButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addButton.textContent = '추가';

  for (var j = 0; j < PRODUCT.length; j++) {
    var o = document.createElement('option');
    o.value = PRODUCT[j].id;
    o.textContent = PRODUCT[j].n + ' - ' + PRODUCT[j].p + '원';
    select.appendChild(o);
  }

  a.appendChild(w);
  w.appendChild(b);

  b.appendChild(h);
  b.appendChild(cartItems);
  b.appendChild(tt);
  b.appendChild(select);
  b.appendChild(addButton);

  function uc() {
    var discountedTotal = 0;
    var totalQuantity = 0;
    var items = cartItems.children;
    var cartTotal = 0;

    for (var m = 0; m < items.length; m++) {
      var item;
      for (var n = 0; n < PRODUCT.length; n++) {
        if (PRODUCT[n].id === items[m].id) {
          item = PRODUCT[n];
          break;
        }
      }
      var quantity = parseInt(
        items[m].querySelector('span').textContent.split('x ')[1]
      );
      var itemTotal = item.p * quantity;
      var disc = 0;

      totalQuantity += quantity;
      cartTotal += itemTotal;
      if (quantity >= 10) {
        if (item.id === 'p1') disc = 0.1;
        else if (item.id === 'p2') disc = 0.15;
        else if (item.id === 'p3') disc = 0.2;
      }
      discountedTotal += itemTotal * (1 - disc);
    }

    var discountRate = 0;
    if (totalQuantity >= 30) {
      var bulkDiscount = discountedTotal * 0.25;
      var individualDiscount = cartTotal - discountedTotal;
      if (bulkDiscount > individualDiscount) {
        discountedTotal = cartTotal * 0.75;
        discountRate = 0.25;
      } else {
        discountRate = (cartTotal - discountedTotal) / cartTotal;
      }
    } else {
      discountRate = (cartTotal - discountedTotal) / cartTotal;
    }

    tt.textContent = '총액: ' + Math.round(discountedTotal) + '원';
    if (discountRate > 0) {
      var dspan = document.createElement('span');
      dspan.className = 'text-green-500 ml-2';
      dspan.textContent =
        '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
      tt.appendChild(dspan);
    }
  }

  addButton.onclick = function () {
    var selectedId = select.value;
    var item;
    for (var k = 0; k < PRODUCT.length; k++) {
      if (PRODUCT[k].id === selectedId) {
        item = PRODUCT[k];
        break;
      }
    }
    if (item) {
      var e = document.getElementById(item.id);
      if (e) {
        var q =
          parseInt(e.querySelector('span').textContent.split('x ')[1]) + 1;
        e.querySelector('span').textContent =
          item.n + ' - ' + item.p + '원 x ' + q;
      } else {
        var d = document.createElement('div'); // div
        var sp = document.createElement('span'); // span
        var bd = document.createElement('div'); //
        var mb = document.createElement('button');
        var pb = document.createElement('button');
        var rb = document.createElement('button');

        d.id = item.id;
        d.className = 'flex justify-between items-center mb-2';
        sp.textContent = item.n + ' - ' + item.p + '원 x 1';
        mb.className =
          'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        mb.textContent = '-';
        mb.dataset.productId = item.id;
        mb.dataset.change = '-1';
        pb.className =
          'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        pb.textContent = '+';
        pb.dataset.productId = item.id;
        pb.dataset.change = '1';
        rb.className = 'remove-item bg-red-500 text-white px-2 py-1 rounded';
        rb.textContent = '삭제';
        rb.dataset.productId = item.id;

        cartItems.appendChild(d);
        d.appendChild(sp);
        d.appendChild(bd);
        bd.appendChild(mb);
        bd.appendChild(pb);
        bd.appendChild(rb);
      }
      uc();
    }
  };

  cartItems.onclick = function (event) {
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

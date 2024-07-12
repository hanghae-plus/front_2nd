function main() {
  var p = [
    {id: 'p1', n: '상품1', p: 10000 },
    {id: 'p2', n: '상품2', p: 20000 },
    {id: 'p3', n: '상품3', p: 30000 }
  ];

  var a = document.getElementById('app');
  var w = document.createElement('div');
  var b = document.createElement('div');
  var h = document.createElement('h1');
  var ct = document.createElement('div');
  var tt = document.createElement('div');
  var s = document.createElement('select');
  var ab = document.createElement('button');

  ct.id = 'cart-items';
  tt.id = 'cart-total';
  s.id = 'product-select';
  ab.id = 'add-to-cart';
  w.className = 'bg-gray-100 p-8';
  b.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  h.className = 'text-2xl font-bold mb-4';
  tt.className = 'text-xl font-bold my-4';
  s.className = 'border rounded p-2 mr-2';
  ab.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  h.textContent = '장바구니';
  ab.textContent = '추가';

  for (var j = 0; j < p.length; j++) {
    var o = document.createElement('option');
    o.value = p[j].id;
    o.textContent = p[j].n + ' - ' + p[j].p + '원';
    s.appendChild(o);
  }

  b.appendChild(h);
  b.appendChild(ct);
  b.appendChild(tt);
  b.appendChild(s);
  b.appendChild(ab);
  w.appendChild(b);
  a.appendChild(w);


  function uc() {
    var t = 0;
    var tq = 0;
    var items = ct.children;
    var tb = 0;

    for (var m = 0; m < items.length; m++) {
      var item;
      for (var n = 0; n < p.length; n++) {
        if (p[n].id === items[m].id) {
          item = p[n];
          break;
        }
      }
      var quantity = parseInt(items[m].querySelector('span').textContent.split('x ')[1]);
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

    tt.textContent = '총액: ' + Math.round(t) + '원';
    if (dr > 0) {
      var dspan = document.createElement('span');
      dspan.className = 'text-green-500 ml-2';
      dspan.textContent = '(' + (dr * 100).toFixed(1) + '% 할인 적용)';
      tt.appendChild(dspan);
    }
  }

  ab.onclick = function() {
    var v = s.value;
    var i;
    for (var k = 0; k < p.length; k++) {
      if (p[k].id === v) {
        i = p[k];
        break;
      }
    }
    if (i) {
      var e = document.getElementById(i.id);
      if (e) {
        var q = parseInt(e.querySelector('span').textContent.split('x ')[1]) + 1;
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
        mb.className = 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        mb.textContent = '-';
        mb.dataset.productId = i.id;
        mb.dataset.change = '-1';
        pb.className = 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
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
        ct.appendChild(d);
      }
      uc();
    }
  };

  ct.onclick = function(event) {
    var target = event.target;
    if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
      var productId = target.dataset.productId;
      var item = document.getElementById(productId);
      if (target.classList.contains('quantity-change')) {
        var change = parseInt(target.dataset.change);
        var quantity = parseInt(item.querySelector('span').textContent.split('x ')[1]) + change;
        if (quantity > 0) {
          item.querySelector('span').textContent = item.querySelector('span').textContent.split('x ')[0] + 'x ' + quantity;
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

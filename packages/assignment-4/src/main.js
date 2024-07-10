function main() {
  let p = [
    { id: 'p1', n: '상품1', p: 10000 },
    { id: 'p2', n: '상품2', p: 20000 },
    { id: 'p3', n: '상품3', p: 30000 },
  ];

  let a = document.getElementById('app');
  let w = document.createElement('div');
  let b = document.createElement('div');
  let h = document.createElement('h1');
  let ct = document.createElement('div');
  let tt = document.createElement('div');
  let s = document.createElement('select');
  let ab = document.createElement('button');

  ct.id = 'cart-items';
  tt.id = 'cart-total';
  s.id = 'product-select';
  ab.id = 'add-to-cart';
  w.className = 'bg-gray-100 p-8';
  b.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  h.className = 'text-2xl font-bold mb-4';
  tt.className = 'text-xl font-bold my-4';
  s.className = 'border rounded p-2 mr-2';
  ab.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  h.textContent = '장바구니';
  ab.textContent = '추가';

  for (let j = 0; j < p.length; j++) {
    let o = document.createElement('option');
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
    // 총 가격을 저장할 변수 t 초기화
    let t = 0;
    // 총 수량을 저장할 변수 tq 초기화
    let tq = 0;
    // ct 요소의 자식 요소들을 items에 저장
    let items = ct.children;
    // 총 상품 가격을 저장할 변수 tb 초기화
    let tb = 0;

    // items 배열을 순회
    for (let m = 0; m < items.length; m++) {
      var item;
      // p 배열을 순회하여 items[m]과 일치하는 id를 가진 item을 찾음
      for (let n = 0; n < p.length; n++) {
        if (p[n].id === items[m].id) {
          item = p[n];
          break;
        }
      }
      // 각 상품의 수량을 추출
      let quantity = parseInt(
        items[m].querySelector('span').textContent.split('x ')[1],
      );
      // 각 상품의 총 가격을 계산
      let itemTotal = item.p * quantity;
      let disc = 0;

      // 총 수량 및 총 상품 가격을 누적
      tq += quantity;
      tb += itemTotal;

      // 수량이 10개 이상인 경우 할인 적용
      if (quantity >= 10) {
        if (item.id === 'p1')
          disc = 0.1; // p1의 경우 10% 할인
        else if (item.id === 'p2')
          disc = 0.15; // p2의 경우 15% 할인
        else if (item.id === 'p3') disc = 0.2; // p3의 경우 20% 할인
      }
      // 총 가격에 할인 적용
      t += itemTotal * (1 - disc);
    }

    // 총 할인율을 저장할 변수 dr 초기화
    let dr = 0;
    // 총 수량이 30개 이상인 경우 추가 할인 적용
    if (tq >= 30) {
      let bulkDiscount = t * 0.25; // 총액의 25% 추가 할인
      let individualDiscount = tb - t;
      // 더 큰 할인율 적용
      if (bulkDiscount > individualDiscount) {
        t = tb * 0.75;
        dr = 0.25;
      } else {
        dr = (tb - t) / tb;
      }
    } else {
      dr = (tb - t) / tb;
    }

    // 최종 총액을 화면에 표시
    tt.textContent = '총액: ' + Math.round(t) + '원';
    // 할인이 적용된 경우 할인율을 화면에 표시
    if (dr > 0) {
      let dspan = document.createElement('span');
      dspan.className = 'text-green-500 ml-2';
      dspan.textContent = '(' + (dr * 100).toFixed(1) + '% 할인 적용)';
      tt.appendChild(dspan);
    }
  }

  ab.onclick = function () {
    let v = s.value;
    let i;
    for (let k = 0; k < p.length; k++) {
      if (p[k].id === v) {
        i = p[k];
        break;
      }
    }
    if (i) {
      let e = document.getElementById(i.id);
      if (e) {
        let q =
          parseInt(e.querySelector('span').textContent.split('x ')[1]) + 1;
        e.querySelector('span').textContent = i.n + ' - ' + i.p + '원 x ' + q;
      } else {
        let d = document.createElement('div');
        let sp = document.createElement('span');
        let bd = document.createElement('div');
        let mb = document.createElement('button');
        let pb = document.createElement('button');
        let rb = document.createElement('button');
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
        ct.appendChild(d);
      }
      uc();
    }
  };

  ct.onclick = function (event) {
    let target = event.target;
    if (
      target.classList.contains('quantity-change') ||
      target.classList.contains('remove-item')
    ) {
      let productId = target.dataset.productId;
      let item = document.getElementById(productId);
      if (target.classList.contains('quantity-change')) {
        let change = parseInt(target.dataset.change);
        let quantity =
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

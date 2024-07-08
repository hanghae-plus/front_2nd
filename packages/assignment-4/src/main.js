function main() {
  /**  상품목록*/
  var p = [
    { id: "p1", n: "상품1", p: 10000 },
    { id: "p2", n: "상품2", p: 20000 },
    { id: "p3", n: "상품3", p: 30000 },
  ];

  /**app root**/
  var a = document.getElementById("app");

  /**root내부 회색 배경 */
  var w = document.createElement("div");

  /**장바구니를 감싸고 있는 card */
  var b = document.createElement("div");

  /**card내부 title */
  var h = document.createElement("h1");

  /**장바구니에 담긴 item div */
  var ct = document.createElement("div");

  /**가격 총액을 담고 있는 div */
  var tt = document.createElement("div");

  /** 상품 목록 select*/
  var s = document.createElement("select");

  /**상품 추가 버튼 */
  var ab = document.createElement("button");

  ct.id = "cart-items";
  tt.id = "cart-total";
  s.id = "product-select";
  ab.id = "add-to-cart";
  w.className = "bg-gray-100 p-8";
  b.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  h.className = "text-2xl font-bold mb-4";
  tt.className = "text-xl font-bold my-4";
  s.className = "border rounded p-2 mr-2";
  ab.className = "bg-blue-500 text-white px-4 py-2 rounded";
  h.textContent = "장바구니";
  ab.textContent = "추가";

  // 상품목록 select에 option을 넘어주는 반복문
  for (var j = 0; j < p.length; j++) {
    var o = document.createElement("option");
    o.value = p[j].id;
    o.textContent = p[j].n + " - " + p[j].p + "원";
    s.appendChild(o);
  }

  b.appendChild(h);
  b.appendChild(ct);
  b.appendChild(tt);
  b.appendChild(s);
  b.appendChild(ab);
  w.appendChild(b);
  a.appendChild(w);

  /**총액을 계산하는 함수 */
  function uc() {
    /**총 금액(할인 o) */
    var t = 0;
    /**장바구니에 담긴 물품의 총 수량 */
    var tq = 0;
    /**장바구니에 담긴 children node */
    var items = ct.children;
    /**총 금액(할인 x) */
    var tb = 0;

    for (var m = 0; m < items.length; m++) {
      var item;
      for (var n = 0; n < p.length; n++) {
        if (p[n].id === items[m].id) {
          item = p[n];
          break;
        }
      }
      var quantity = parseInt(
        items[m].querySelector("span").textContent.split("x ")[1]
      );

      /**해당 id 아이템의 총 수량 */
      var itemTotal = item.p * quantity;
      /**해당 id에 따른 할인율 */
      var disc = 0;

      tq += quantity;
      tb += itemTotal;
      if (quantity >= 10) {
        if (item.id === "p1") disc = 0.1;
        else if (item.id === "p2") disc = 0.15;
        else if (item.id === "p3") disc = 0.2;
      }
      t += itemTotal * (1 - disc);
    }

    /**할인율 */
    var dr = 0;

    //물품의 총갯수가 30개 이상이라면??
    if (tq >= 30) {
      //25퍼센트 할인 금액
      var bulkDiscount = t * 0.25;
      //개별 할인 금액
      var individualDiscount = tb - t;

      //25퍼센트 할인금액이 개별 할인 금액보다 크다면??
      if (bulkDiscount > individualDiscount) {
        t = tb * 0.75;
        dr = 0.25;
      }
      //개별할인 금액이 더 크다면??
      else {
        dr = (tb - t) / tb;
      }
    }
    //물품의 총갯수가 30개 미만이라면??
    else {
      dr = (tb - t) / tb;
    }

    tt.textContent = "총액: " + Math.round(t) + "원";
    if (dr > 0) {
      var dspan = document.createElement("span");
      dspan.className = "text-green-500 ml-2";
      dspan.textContent = "(" + (dr * 100).toFixed(1) + "% 할인 적용)";
      tt.appendChild(dspan);
    }
  }

  /**추가 버튼 이벤트 핸들러 */
  ab.onclick = function () {
    /**현재 select된 item의 id값 */
    var v = s.value;

    /**클릭한 상품의 세부 목록(objec) */
    var i;

    /**상품 목록에서 선택한 id로 값을 찾는 과정 */
    for (var k = 0; k < p.length; k++) {
      if (p[k].id === v) {
        i = p[k];
        break;
      }
    }

    if (i) {
      var e = document.getElementById(i.id);

      //선택한 상품이 이미 장바구니에 있다면??
      if (e) {
        var q =
          parseInt(e.querySelector("span").textContent.split("x ")[1]) + 1;
        e.querySelector("span").textContent = i.n + " - " + i.p + "원 x " + q;
      }
      //선택한 상품이 장바구니에 없다면??
      else {
        /**상품의 id를 해당 태그 id로 지정 */
        var d = document.createElement("div");
        /**장바구니 상품 정보 span */
        var sp = document.createElement("span");
        /**장바구니 아이템에 버튼을 grouping하는 div */
        var bd = document.createElement("div");
        /**상품 +버튼 */
        var mb = document.createElement("button");
        /**상품 -버튼 */
        var pb = document.createElement("button");
        /**상품 삭제 버튼 */
        var rb = document.createElement("button");

        d.id = i.id;
        d.className = "flex justify-between items-center mb-2";
        sp.textContent = i.n + " - " + i.p + "원 x 1";

        //상품 +버튼 관련
        mb.className =
          "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1";
        mb.textContent = "-";
        mb.dataset.productId = i.id;
        mb.dataset.change = "-1";

        //상품 +버튼 관련
        pb.className =
          "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1";
        pb.textContent = "+";
        pb.dataset.productId = i.id;
        pb.dataset.change = "1";

        //상품 삭제 버튼 관련
        rb.className = "remove-item bg-red-500 text-white px-2 py-1 rounded";
        rb.textContent = "삭제";
        rb.dataset.productId = i.id;
        bd.appendChild(mb);
        bd.appendChild(pb);
        bd.appendChild(rb);
        d.appendChild(sp);
        d.appendChild(bd);
        ct.appendChild(d);
      }
      //금액 업데이트
      uc();
    }
  };

  /**장바구니에 담긴 상품 버튼들에 대한 이벤트(+,-,삭제 버튼) */
  ct.onclick = function (event) {
    var target = event.target;

    /**
     * 버튼의 class에 'quantity-chagne'(+,- 버튼) 혹은
     * 'remove-item'(삭제 버튼)이 포함되어 있다면??
     */
    if (
      target.classList.contains("quantity-change") ||
      target.classList.contains("remove-item")
    ) {
      var productId = target.dataset.productId;

      /**장바구니에 있는 아이템 */
      var item = document.getElementById(productId);

      // +,- 버튼일 경우
      if (target.classList.contains("quantity-change")) {
        /**해당 버튼의 change dataset
         * -버튼의 경우 data property로 -1
         * +버튼의 경우 data property로 +1
         */
        var change = parseInt(target.dataset.change);

        /**해당 아이템의 총 수량 */
        var quantity =
          parseInt(item.querySelector("span").textContent.split("x ")[1]) +
          change;

        // 수량이 1개이상인 경우
        if (quantity > 0) {
          item.querySelector("span").textContent =
            item.querySelector("span").textContent.split("x ")[0] +
            "x " +
            quantity;
        }
        // 수량이 없는 경우
        else {
          item.remove();
        }
      }
      // 그외(삭제 버튼)의 경우
      else if (target.classList.contains("remove-item")) {
        item.remove();
      }
      uc();
    }
  };
}

main();

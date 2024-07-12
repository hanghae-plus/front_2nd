import {
  cartItem,
  totalAmt,
  selectedProd,
  addCart,
  bkground,
  bkgAll,
  textSize,
} from "./main.basic.html.js";

const firstView = () => {
  var products = [
    { id: "p1", prodNum: "상품1", price: 10000 },
    { id: "p2", prodNum: "상품2", price: 20000 },
    { id: "p3", prodNum: "상품3", price: 30000 },
  ];
  var htmlView = document.getElementById("app");

  textSize.textContent = "장바구니";
  addCart.textContent = "추가";
  for (var j = 0; j < products.length; j++) {
    var dropItem = document.createElement("option");
    dropItem.value = products[j].id;
    dropItem.textContent =
      products[j].prodNum + " - " + products[j].price + "원";
    selectedProd.appendChild(dropItem);
  }
  bkgAll.appendChild(textSize);
  bkgAll.appendChild(cartItem);
  bkgAll.appendChild(totalAmt);
  bkgAll.appendChild(selectedProd);
  bkgAll.appendChild(addCart);
  bkground.appendChild(bkgAll);
  htmlView.appendChild(bkground);
};

export default firstView;

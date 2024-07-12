import { cartItem, totalAmt } from "./main.basic.html.js";
import products from "./mockData.js";

function discountPrice() {
  var totalPrice = 0;
  var totalQunt = 0;
  var items = cartItem.children;
  var originAmt = 0;

  for (var m = 0; m < items.length; m++) {
    var item;
    for (var n = 0; n < products.length; n++) {
      if (products[n].id === items[m].id) {
        item = products[n];
        break;
      }
    }
    var quantity = parseInt(
      items[m].querySelector("span").textContent.split("x ")[1]
    );
    var itemTotal = item.price * quantity;
    var disc = 0;

    totalQunt += quantity;
    originAmt += itemTotal;

    if (quantity >= 10) {
      if (item.id === "p1") disc = 0.1;
      else if (item.id === "p2") disc = 0.15;
      else {
        disc = 0.2;
      }
    }

    totalPrice += itemTotal * (1 - disc);
  }

  var discountRate = 0;

  if (totalQunt >= 30) {
    var bulkDiscount = totalPrice * 0.25;
    var individualDiscount = originAmt - totalPrice;
    if (bulkDiscount > individualDiscount) {
      totalPrice = originAmt * 0.75;
      discountRate = 0.25;
    } else {
      discountRate = (originAmt - totalPrice) / originAmt;
    }
  } else {
    discountRate = (originAmt - totalPrice) / originAmt;
  }

  totalAmt.textContent = "총액: " + Math.round(totalPrice) + "원";
  if (discountRate > 0) {
    var disRateSpan = document.createElement("span");
    disRateSpan.className = "text-green-500 ml-2";
    disRateSpan.textContent =
      "(" + (discountRate * 100).toFixed(1) + "% 할인 적용)";
    totalAmt.appendChild(disRateSpan);
  }
}

export default discountPrice;

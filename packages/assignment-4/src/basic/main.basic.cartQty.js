import { cartItem } from "./main.basic.html.js";
import discountPrice from "./main.basic.discount.js";

const cartQty = () => {
  cartItem.onclick = function (event) {
    //가져오는 값들을 변수에 할당해서 좀... 줄였음
    var targetDataset = event.target.dataset;
    var targetList = event.target.classList;

    if (
      targetList.contains("quantity-change") ||
      targetList.contains("remove-item")
    ) {
      var productId = targetDataset.productId;
      var item = document.getElementById(productId);

      if (targetList.contains("quantity-change")) {
        var change = parseInt(targetDataset.change);
        var quantity =
          parseInt(item.querySelector("span").textContent.split("x ")[1]) +
          change;

        if (quantity > 0) {
          item.querySelector("span").textContent =
            item.querySelector("span").textContent.split("x ")[0] +
            "x " +
            quantity;
        } else {
          item.remove();
        }
        //else if -> else로 변경
      } else {
        item.remove();
      }
      discountPrice();
    }
  };
};

export default cartQty;

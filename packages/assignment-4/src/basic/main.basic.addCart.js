import { cartItem, selectedProd, addCart } from "./main.basic.html.js";
import products from "./mockData.js";
import discountPrice from "./main.basic.discount.js";

const addCartFun = () => {
  addCart.onclick = function () {
    var productName = selectedProd.value;
    var selectedProduct;

    for (var k = 0; k < products.length; k++) {
      if (products[k].id === productName) {
        selectedProduct = products[k];
        break;
      }
    }

    if (selectedProduct) {
      var existingEl = document.getElementById(selectedProduct.id);

      if (existingEl) {
        var quantity =
          parseInt(
            existingEl.querySelector("span").textContent.split("x ")[1]
          ) + 1;
        existingEl.querySelector("span").textContent =
          selectedProduct.prodNum +
          " - " +
          selectedProduct.price +
          "원 x " +
          quantity;
      } else {
        var newItem = document.createElement("div");
        newItem.className = "flex justify-between items-center mb-2";
        newItem.id = selectedProduct.id;

        var span = document.createElement("span");
        span.textContent =
          selectedProduct.prodNum + " - " + selectedProduct.price + "원 x 1";

        var buttonContainer = document.createElement("div");

        var minusBtn = document.createElement("button");
        minusBtn.className =
          "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1";
        minusBtn.textContent = "-";
        minusBtn.dataset.productId = selectedProduct.id;
        minusBtn.dataset.change = "-1";

        var plusBtn = document.createElement("button");
        plusBtn.className =
          "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1";
        plusBtn.textContent = "+";
        plusBtn.dataset.productId = selectedProduct.id;
        plusBtn.dataset.change = "1";

        var removeBtn = document.createElement("button");
        removeBtn.className =
          "remove-item bg-red-500 text-white px-2 py-1 rounded";
        removeBtn.textContent = "삭제";
        removeBtn.dataset.productId = selectedProduct.id;

        buttonContainer.appendChild(minusBtn);
        buttonContainer.appendChild(plusBtn);
        buttonContainer.appendChild(removeBtn);
        newItem.appendChild(span);
        newItem.appendChild(buttonContainer);
        cartItem.appendChild(newItem);
      }
      discountPrice();
    }
  };
};

export default addCartFun;

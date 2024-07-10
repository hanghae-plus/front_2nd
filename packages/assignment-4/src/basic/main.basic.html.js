function createElementTotal(tag, classNames, id) {
  var element = document.createElement(tag);
  if (classNames && classNames.trim() !== "") {
    if (Array.isArray(classNames)) {
      element.classList.add(...classNames);
    } else {
      element.className = classNames;
    }
  }
  if (id) {
    element.id = id;
  }
  return element;
}

var cartItem = createElementTotal("div", "", "cart-items");
var totalAmt = createElementTotal(
  "div",
  "text-xl font-bold my-4",
  "cart-total"
);
var selectedProd = createElementTotal(
  "select",
  "border rounded p-2 mr-2",
  "product-select"
);
var addCart = createElementTotal(
  "button",
  "bg-blue-500 text-white px-4 py-2 rounded",
  "add-to-cart"
);
var bkground = createElementTotal("div", "bg-gray-100 p-8");
var bkgAll = createElementTotal(
  "div",
  "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"
);
var textSize = createElementTotal("h1", "text-2xl font-bold mb-4");

export {
  cartItem,
  totalAmt,
  selectedProd,
  addCart,
  bkground,
  bkgAll,
  textSize,
};

const discountRatio = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  quantityOver30: 0.25,
};

export function createShoppingCart() {
  let cart = [];

  function findCartItem(productId) {
    return cart.find((item) => item.product.id === productId);
  }

  function getTotal() {
    let originTotal = 0;
    let totalQuantity = 0;
    let total = 0;
    cart.forEach((item) => {
      item.quantity < 10
        ? (total += item.product.price * item.quantity)
        : (total += item.product.price * item.quantity * (1 - discountRatio[item.product.id]));
      originTotal += item.product.price * item.quantity;
      totalQuantity += item.quantity;
    });
    if (totalQuantity >= 30) total = originTotal * 0.75;
    return { total, originTotal };
  }

  function applyDiscount(total, originTotal) {
    // const productCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    // let discountRate = 0;
    //
    // if (productCount >= 30) {
    //   discountRate = 0.25;
    // } else {
    //   cart.forEach((item) => {
    //     const { discount } = item.product;
    //     if (discount && item.quantity >= discount[0][0]) {
    //       discountRate = Math.max(discountRate, discount[0][1]);
    //     }
    //   });
    // }
    //
    // const discountedTotal = total * (1 - discountRate);

    let discountRate = (originTotal - total) / originTotal;
    return { total, discountRate };
  }

  function addItem(product, quantity = 1) {
    const existingItem = findCartItem(product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
  }

  function removeItem(productId) {
    cart = cart.filter((item) => item.product.id !== productId);
  }

  function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      const item = findCartItem(productId);
      if (item) {
        item.quantity = newQuantity;
      }
    }
  }

  function getItems() {
    return [...cart];
  }

  return {
    addItem,
    removeItem,
    updateQuantity,
    getItems,
    getTotal: () => {
      const { total, originTotal } = getTotal();
      const { total: discountedTotal, discountRate } = applyDiscount(total, originTotal);
      return { total: discountedTotal, discountRate };
    },
  };
}

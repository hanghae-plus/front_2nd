// ../createShoppingCart.js

export function createShoppingCart() {
  let items = [];

  function addItem(product, quantity = 1) {
    const existingItem = items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    if (existingItem && existingItem.quantity <= 0) {
      items = items.filter(item => item.product.id !== product.id);
    }
  }

  function removeItem(productId) {
    items = items.filter(item => item.product.id !== productId);
  }

  function updateQuantity(productId, quantity) {
    const item = items.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        removeItem(productId);
      }
    }
  }

  function getItems() {
    return items;
  }

  function getTotal() {
    let total = 0;
    let totalItems = 0;
    let totalDiscount = 0;

    items.forEach(item => {
      const product = item.product;
      const quantity = item.quantity;
      const productTotal = product.price * quantity;
      total += productTotal;
      totalItems += quantity;

      const discount = product.discount?.find(d => quantity >= d[0]);
      if (discount) {
        totalDiscount += productTotal * discount[1];
      }
    });

    if (totalItems >= 30) {
      totalDiscount = Math.max(totalDiscount, total * 0.25);
    }

    const discountRate = totalDiscount / total;
    total -= totalDiscount;

    return { total, discountRate };
  }

  return {
    addItem,
    removeItem,
    updateQuantity,
    getItems,
    getTotal
  };
}

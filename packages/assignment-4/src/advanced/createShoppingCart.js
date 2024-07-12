// 1. 데이터를 다루는 코드 (createShoppingCart)
export default function createShoppingCart() {
  const DISCOUNT_THRESHOLDS = {
      BULK_QUANTITY: 30,
      BULK_RATE: 0.25,
      PRODUCT_QUANTITY: 10
  };

  const PRODUCT_DISCOUNTS = {
      p1: 0.1,
      p2: 0.15,
      p3: 0.2
  };

  const products = [
      { id: 'p1', name: '상품1', price: 10000 },
      { id: 'p2', name: '상품2', price: 20000 },
      { id: 'p3', name: '상품3', price: 30000 },
  ];

  let cartItems = [];

  function addItem(productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
          const existingItem = cartItems.find(item => item.id === productId);
          if (existingItem) {
              existingItem.quantity++;
          } else {
              cartItems.push({ ...product, quantity: 1 });
          }
      }
  }

  function removeItem(productId) {
      cartItems = cartItems.filter(item => item.id !== productId);
  }

  function updateItemQuantity(productId, change) {
      const item = cartItems.find(item => item.id === productId);
      if (item) {
          item.quantity += change;
          if (item.quantity <= 0) {
              removeItem(productId);
          }
      }
  }

  function calculateTotal() {
      let total = 0;
      let totalQuantity = 0;
      let totalBeforeDiscount = 0;

      cartItems.forEach(item => {
          const itemTotal = item.price * item.quantity;
          totalQuantity += item.quantity;
          totalBeforeDiscount += itemTotal;

          const discount = item.quantity >= DISCOUNT_THRESHOLDS.PRODUCT_QUANTITY ? PRODUCT_DISCOUNTS[item.id] || 0 : 0;
          total += itemTotal * (1 - discount);
      });

      const bulkDiscount = totalQuantity >= DISCOUNT_THRESHOLDS.BULK_QUANTITY ? totalBeforeDiscount * DISCOUNT_THRESHOLDS.BULK_RATE : 0;
      if (bulkDiscount > (totalBeforeDiscount - total)) {
          total = totalBeforeDiscount * (1 - DISCOUNT_THRESHOLDS.BULK_RATE);
      }

      const discountRate = (totalBeforeDiscount - total) / totalBeforeDiscount;
      return { total, discountRate, totalBeforeDiscount };
  }

  return {
      products,
      cartItems,
      addItem,
      removeItem,
      updateItemQuantity,
      calculateTotal
  };
}
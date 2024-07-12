// createShoppingCart.js
export function createShoppingCart() {
  let items = []

  const findItem = (productId) =>
    items.find((item) => item.product.id === productId)

  const calculateTotal = () => {
    const total = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    )
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

    let individualDiscounts = items.map((item) => {
      let maxDiscount = 0
      for (const [qty, discount] of item.product.discount || []) {
        if (item.quantity >= qty) {
          maxDiscount = Math.max(maxDiscount, discount)
        }
      }
      return item.product.price * item.quantity * maxDiscount
    })

    let maxIndividualDiscount = individualDiscounts.reduce(
      (acc, discount) => acc + discount,
      0,
    )

    // 전체 할인 계산
    let totalDiscount = total * (totalItems >= 30 ? 0.25 : 0)

    // 더 큰 할인을 적용
    let finalDiscount = Math.max(maxIndividualDiscount, totalDiscount)

    const discountedTotal = total - finalDiscount
    const discountRate = finalDiscount / total

    return { total: Math.round(discountedTotal), discountRate }
  }

  return {
    addItem(product, quantity = 1) {
      const existingItem = findItem(product.id)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        items.push({ product, quantity })
      }
    },
    removeItem(productId) {
      items = items.filter((item) => item.product.id !== productId)
    },
    updateQuantity(productId, quantity) {
      const existingItem = findItem(productId)
      if (existingItem) {
        existingItem.quantity = quantity
        if (existingItem.quantity <= 0) {
          this.removeItem(productId)
        }
      }
    },
    getItems() {
      return items
    },
    getTotal() {
      return calculateTotal()
    },
  }
}

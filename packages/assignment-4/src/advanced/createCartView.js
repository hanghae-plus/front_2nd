// createCartView.js
import { createShoppingCart } from './createShoppingCart.js'
import { MainLayout, CartItem, CartTotal } from './templates.js'

export function createCartView({ products }) {
  const cart = createShoppingCart()

  const renderCart = () => {
    const items = cart.getItems()
    const cartItems = items.map(CartItem).join('')
    const { total, discountRate } = cart.getTotal()
    const cartTotal = CartTotal({ total, discountRate })
    document.getElementById('cart-items').innerHTML = cartItems
    document.getElementById('cart-total').innerHTML = cartTotal
  }

  document.getElementById('app').innerHTML = MainLayout({ items: products })

  document.getElementById('add-to-cart').addEventListener('click', () => {
    const select = document.getElementById('product-select')
    const productId = select.value
    const product = products.find((p) => p.id === productId)
    cart.addItem(product)
    renderCart()
  })

  document.getElementById('cart-items').addEventListener('click', (event) => {
    if (event.target.classList.contains('quantity-change')) {
      const productId = event.target.dataset.productId
      const change = parseInt(event.target.dataset.change)
      const item = cart.getItems().find((item) => item.product.id === productId)
      cart.updateQuantity(productId, item.quantity + change)
      renderCart()
    }
    if (event.target.classList.contains('remove-item')) {
      const productId = event.target.dataset.productId
      cart.removeItem(productId)
      renderCart()
    }
  })

  return { renderCart }
}

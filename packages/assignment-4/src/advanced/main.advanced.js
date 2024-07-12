// main.advanced.js
import { createShoppingCart } from './createShoppingCart.js'
import { MainLayout, CartItem, CartTotal } from './templates.js'

const cart = createShoppingCart()

const products = [
  { id: 'p1', name: '상품1', price: 10000, discount: [[10, 0.1]] },
  { id: 'p2', name: '상품2', price: 20000, discount: [[10, 0.15]] },
  { id: 'p3', name: '상품3', price: 30000, discount: [[10, 0.2]] },
]

document.getElementById('app').innerHTML = MainLayout({ items: products })

const renderCart = () => {
  const items = cart.getItems()
  const cartItems = items.map(CartItem).join('')
  const { total, discountRate } = cart.getTotal()
  const cartTotal = CartTotal({ total, discountRate })
  document.getElementById('cart-items').innerHTML = cartItems
  document.getElementById('cart-total').innerHTML = cartTotal
}

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

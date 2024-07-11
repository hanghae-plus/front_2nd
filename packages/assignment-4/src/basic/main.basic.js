const PRODUCTS = [
  { id: 'p1', name: '상품1', price: 10000 },
  { id: 'p2', name: '상품2', price: 20000 },
  { id: 'p3', name: '상품3', price: 30000 },
]

function main() {
  const a = document.getElementById('app')
  const w = document.createElement('div')
  const b = document.createElement('div')
  const h = document.createElement('h1')
  const ct = document.createElement('div')
  const tt = document.createElement('div')
  const s = document.createElement('select')
  const ab = document.createElement('button')

  ct.id = 'cart-items'
  tt.id = 'cart-total'
  s.id = 'product-select'
  ab.id = 'add-to-cart'
  w.className = 'bg-gray-100 p-8'
  b.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'
  h.className = 'text-2xl font-bold mb-4'
  tt.className = 'text-xl font-bold my-4'
  s.className = 'border rounded p-2 mr-2'
  ab.className = 'bg-blue-500 text-white px-4 py-2 rounded'
  h.textContent = '장바구니'
  ab.textContent = '추가'

  PRODUCTS.forEach((product) => {
    const o = document.createElement('option')
    o.value = product.id
    o.textContent = `${product.name} - ${product.price}원`
    s.appendChild(o)
  })

  b.appendChild(h)
  b.appendChild(ct)
  b.appendChild(tt)
  b.appendChild(s)
  b.appendChild(ab)
  w.appendChild(b)
  a.appendChild(w)

  function uc() {
    let t = 0
    let tq = 0
    const items = ct.children
    let tb = 0

    for (let m = 0; m < items.length; m += 1) {
      let item
      for (let n = 0; n < PRODUCTS.length; n += 1) {
        if (PRODUCTS[n].id === items[m].id) {
          item = PRODUCTS[n]
          break
        }
      }
      const quantity = parseInt(items[m].querySelector('span').textContent.split('x ')[1])
      const itemTotal = item.price * quantity
      let disc = 0

      tq += quantity
      tb += itemTotal
      if (quantity >= 10) {
        if (item.id === 'p1') disc = 0.1
        else if (item.id === 'p2') disc = 0.15
        else if (item.id === 'p3') disc = 0.2
      }
      t += itemTotal * (1 - disc)
    }

    let dr = 0
    if (tq >= 30) {
      const bulkDiscount = t * 0.25
      const individualDiscount = tb - t
      if (bulkDiscount > individualDiscount) {
        t = tb * 0.75
        dr = 0.25
      } else {
        dr = (tb - t) / tb
      }
    } else {
      dr = (tb - t) / tb
    }

    tt.textContent = '총액: ' + Math.round(t) + '원'
    if (dr > 0) {
      const dspan = document.createElement('span')
      dspan.className = 'text-green-500 ml-2'
      dspan.textContent = '(' + (dr * 100).toFixed(1) + '% 할인 적용)'
      tt.appendChild(dspan)
    }
  }

  ab.onclick = function () {
    const v = s.value
    let i
    for (let k = 0; k < PRODUCTS.length; k += 1) {
      if (PRODUCTS[k].id === v) {
        i = PRODUCTS[k]
        break
      }
    }
    if (i) {
      const e = document.getElementById(i.id)
      if (e) {
        const q = parseInt(e.querySelector('span').textContent.split('x ')[1]) + 1
        e.querySelector('span').textContent = i.name + ' - ' + i.price + '원 x ' + q
      } else {
        const d = document.createElement('div')
        const sp = document.createElement('span')
        const bd = document.createElement('div')
        const mb = document.createElement('button')
        const pb = document.createElement('button')
        const rb = document.createElement('button')
        d.id = i.id
        d.className = 'flex justify-between items-center mb-2'
        sp.textContent = i.name + ' - ' + i.price + '원 x 1'
        mb.className = 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
        mb.textContent = '-'
        mb.dataset.productId = i.id
        mb.dataset.change = '-1'
        pb.className = 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
        pb.textContent = '+'
        pb.dataset.productId = i.id
        pb.dataset.change = '1'
        rb.className = 'remove-item bg-red-500 text-white px-2 py-1 rounded'
        rb.textContent = '삭제'
        rb.dataset.productId = i.id
        bd.appendChild(mb)
        bd.appendChild(pb)
        bd.appendChild(rb)
        d.appendChild(sp)
        d.appendChild(bd)
        ct.appendChild(d)
      }
      uc()
    }
  }

  ct.onclick = function (event) {
    const target = event.target
    if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
      const productId = target.dataset.productId
      const item = document.getElementById(productId)
      if (target.classList.contains('quantity-change')) {
        const change = parseInt(target.dataset.change)
        const quantity = parseInt(item.querySelector('span').textContent.split('x ')[1]) + change
        if (quantity > 0) {
          item.querySelector('span').textContent =
            item.querySelector('span').textContent.split('x ')[0] + 'x ' + quantity
        } else {
          item.remove()
        }
      } else if (target.classList.contains('remove-item')) {
        item.remove()
      }
      uc()
    }
  }
}

main()

/*
 * 가독성을 떨어트리는 로직에 중요하지 않은 옵션데이터는 분리해서 관리
 * */
export const appOptions = {
  section: { className: 'bg-gray-100 p-8' },
  cart: {
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  },
  title: { textContent: '장바구니', className: 'text-2xl font-bold mb-4' },
  total: { id: 'cart-total', className: 'text-xl font-bold my-4' },
  cartItems: { id: 'cart-items' },
  select: { id: 'product-select', className: 'border rounded p-2 mr-2' },
  addBtn: {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  },
};

export const itemOptions = {
  itemBox: { className: 'flex justify-between items-center mb-2' },
  minusBtn: {
    className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
    textContent: '-',
  },
  plusBtn: {
    className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
    textContent: '+',
  },
  removeBtn: {
    className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
    textContent: '삭제',
  },
};

export const discountOptions = {
  id: 'add-to-cart',
  className: 'text-green-500 ml-2',
};

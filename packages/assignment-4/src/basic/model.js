export const PRODUCTS = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
  },
];

export const DISCOUNTS = {
  bulk: {
    threshold: 30,
    ratio: 0.25,
  },
  p1: {
    threshold: 10,
    ratio: 0.1,
  },
  p2: {
    threshold: 10,
    ratio: 0.15,
  },
  p3: {
    threshold: 10,
    ratio: 0.2,
  },
};

export const BUTTON_CLASSNAMES = {
  plus: 'quantity-change',
  minus: 'quantity-change',
  remove: 'remove-item',
};

export const LAYOUTS = {
  app: {
    type: 'app',
    props: { id: 'app' },
  },

  wrapper: {
    type: 'div',
    props: { id: 'wrapper', className: 'bg-gray-100 p-8' },
  },

  block: {
    type: 'div',
    props: {
      id: 'block',
      className:
        'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
    },
  },

  header: {
    type: 'h1',
    props: {
      id: 'header',
      className: 'text-2xl font-bold mb-4',
      textContent: '장바구니',
    },
  },

  cartItem: {
    type: 'div',
    props: { id: 'cart-items', className: '' },
  },

  cartTotal: {
    type: 'div',
    props: { id: 'cart-total', className: 'text-xl font-bold my-4' },
  },

  productSelect: {
    type: 'select',
    props: { id: 'product-select', className: 'border rounded p-2 mr-2' },
  },

  addToCart: {
    type: 'button',
    props: {
      id: 'add-to-cart',
      className: 'bg-blue-500 text-white px-4 py-2 rounded',
      textContent: '추가',
    },
  },

  option: {
    type: 'option',
    props: {},
  },

  cartRow: {
    type: 'div',
    props: {
      id: null,
      className: 'flex justify-between items-center minusButton-2',
    },
  },

  informText: {
    type: 'span',
    props: {
      textContent: '',
    },
  },

  buttonContainer: {
    type: 'div',
  },

  minusButton: {
    type: 'button',
    props: {
      className: `${BUTTON_CLASSNAMES.minus} bg-blue-500 text-white px-2 py-1 rounded mr-1`,
      textContent: '-',
    },
  },

  plusButton: {
    type: 'button',
    props: {
      className: `${BUTTON_CLASSNAMES.plus} bg-blue-500 text-white px-2 py-1 rounded mr-1`,
      textContent: '+',
    },
  },

  removeButton: {
    type: 'button',
    props: {
      className: `${BUTTON_CLASSNAMES.remove} bg-red-500 text-white px-2 py-1 rounded`,
      textContent: '삭제',
    },
  },

  discountSpan: {
    type: 'span',
    props: {
      className: 'text-green-500 ml-2',
      textContent: '',
    },
  },
};

export const TEXT = {
  optionText: '$name-$price원',
  cartRowInformText: '$name - $price원 x $quantity',
  cartTotalPriceText: '총액: $price원',
  cartTotalDiscountText: '($ratio% 할인 적용)',
};

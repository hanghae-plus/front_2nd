import { useState } from "react";


const data = [
  { id: "p1", name: "상품1", cost: 10000 },
  { id: "p2", name: "상품2", cost: 20000 },
  { id: "p3", name: "상품3", cost: 30000 },
];

function App() {
  const [cart, setCart] = useState([]);
  const totalCost;

  const Item = (item) => {
    <div id={item.id} class="flex justify-between items-center mb-2">
      <div id="p1" class="flex justify-between items-center mb-2">
        <span>
          {item.name} - {item.cost}원 x {item?.cnt}
        </span>
        <div>
          <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1">
            -
          </button>
          <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1">
            +
          </button>
          <button className="remove-item bg-red-500 text-white px-2 py-1 rounded">
            삭제
          </button>
        </div>
      </div>
    </div>;
    return;
  };

  return (
    <div class="bg-gray-100 p-8">
      <div className="max-div1-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-div1-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {cart.map((item) => {
            return <Item item={item} />;
          })}
        </div>
        {totalCost > 0 && (
          <div id="cart-total" class="text-xl font-bold my-4">
            {totalCost}
          </div>
        )}
        <select id="product-select" class="border rounded p-2 mr-2">
          {data.map((option) => {
            return (
              <option value={option.id} key={option.id}>
                {option.name} - {option.cost}원
              </option>
            );
          })}
        </select>
        <button
          id="add-to-cart"
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          추가
        </button>
      </div>
    </div>
  );
}

export default App;

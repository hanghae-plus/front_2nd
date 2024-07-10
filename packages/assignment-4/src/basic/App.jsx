import { useState, useEffect } from "react";
import { OPTIONS } from "./constant";
import Selector from "./components/Selector";
import Cart from "./components/Cart";
import TotalCost from "./components/TotalCost";

function App() {
  const [cart, setCart] = useState(
    OPTIONS.map((option) => {
      return { ...option, cnt: 0 };
    })
  );
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  const CartAddButton = () => {
    return (
      <button
        id="add-to-cart"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => {
          setCart((x) => {
            const next = [...x];
            next[selectedOptionIndex] = {
              ...next[selectedOptionIndex],
              cnt: next[selectedOptionIndex].cnt + 1,
            };
            return next;
          });
        }}
      >
        추가
      </button>
    );
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-div1-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-div1-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>

        <Cart cart={cart} setCart={setCart} />

        <TotalCost cart={cart} />

        <Selector
          selectedOptionIndex={selectedOptionIndex}
          setSelectedOptionIndex={setSelectedOptionIndex}
        />

        <CartAddButton />
      </div>
    </div>
  );
}

export default App;

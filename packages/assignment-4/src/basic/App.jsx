import { useState, useEffect } from "react";
import { OPTIONS } from "./constant";
import Selector from "./components/Selector";
import Cart from "./components/Cart";
import TotalCost from "./components/TotalCost";
import CartAddButton from "./components/CartAddButton";

function App() {
  const [cart, setCart] = useState(
    OPTIONS.map((option) => {
      return { ...option, cnt: 0 };
    })
  );
  const [selectedOptionId, setSelectedOptionId] = useState(OPTIONS[0].id);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-div1-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-div1-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>

        <Cart cart={cart} setCart={setCart} />

        <TotalCost cart={cart} />

        <Selector
          selectedOptionId={selectedOptionId}
          setSelectedOptionId={setSelectedOptionId}
        />

        <CartAddButton setCart={setCart} selectedOptionId={selectedOptionId} />
      </div>
    </div>
  );
}

export default App;

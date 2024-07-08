import { useState, useEffect, useRef } from "react";
import useCalcurateCost from "./useCalcurateCost";

const OPTIONS = [
  { id: "p1", name: "상품1", cost: 10000 },
  { id: "p2", name: "상품2", cost: 20000 },
  { id: "p3", name: "상품3", cost: 30000 },
];

// 방법1. cart에 순차적으로 담고 보여질 때만 정리
// 방법2. cart에 담을 때부터 정리
//immer설치가 안 되네..

function App() {
  const [cart, setCart] = useState(
    OPTIONS.map((option) => {
      return { ...option, cnt: 0 };
    })
  );
  const [selectOption, setSelectedOption] = useState(0);
  const totalCost = useCalcurateCost(cart);

  const handleSelectChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    setSelectedOption(selectedIndex);
  };

  const Item = ({ item, key }) => {
    const index = OPTIONS.findIndex((option) => option.id === item.id);

    return (
      <div className="flex justify-between items-center mb-2" key={key}>
        <span>
          {item.name} - {item.cost}원 x {item.cnt}
        </span>
        <div>
          <button
            className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
            onClick={() => {
              setCart((x) => {
                const next = [...x];
                next[index] = {
                  ...next[index],
                  cnt: next[index].cnt - 1,
                };
                return next;
              });
            }}
          >
            -
          </button>
          <button
            className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
            onClick={() => {
              setCart((x) => {
                const next = [...x];
                next[index] = {
                  ...next[index],
                  cnt: next[index].cnt + 1,
                };
                return next;
              });
            }}
          >
            +
          </button>
          <button
            className="remove-item bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => {
              setCart((x) => {
                const next = [...x];
                next[index] = {
                  ...next[index],
                  cnt: 0,
                };
                return next;
              });
            }}
          >
            삭제
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-div1-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-div1-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {cart.map((item) => {
            return item.cnt > 0 ? (
              <Item item={item} key={`item${item.id}`} />
            ) : (
              <></>
            );
          })}
        </div>
        {totalCost > 0 && (
          <div id="cart-total" className="text-xl font-bold my-4">
            {totalCost}
          </div>
        )}
        <select
          id="product-select"
          className="border rounded p-2 mr-2"
          onChange={handleSelectChange}
        >
          {OPTIONS.map((option) => {
            return (
              <option
                value={option.id}
                key={`option${option.id}`}
                onChange={handleSelectChange}
              >
                {option.name} - {option.cost}원
              </option>
            );
          })}
        </select>
        <button
          id="add-to-cart"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setCart((x) => {
              const next = [...x];
              next[selectOption] = {
                ...next[selectOption],
                cnt: next[selectOption].cnt + 1,
              };
              return next;
            });
          }}
        >
          추가
        </button>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";

const OPTIONS = [
  { id: "p1", name: "상품1", cost: 10000 },
  { id: "p2", name: "상품2", cost: 20000 },
  { id: "p3", name: "상품3", cost: 30000 },
];

function App() {
  const [cart, setCart] = useState(
    OPTIONS.map((option) => {
      return { ...option, cnt: 0 };
    })
  );
  const [selectOption, setSelectedOption] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const { nowTotalCost, dcTotalCost, totalCnt } = calcurateTotalCost(cart);
    const { conclusedTotalCost, totalDc } = calcurateDiscount(
      nowTotalCost,
      dcTotalCost,
      totalCnt
    );

    setTotalCost(conclusedTotalCost);
    setDiscount(totalDc);
  }, [cart]);

  const calcurateTotalCost = (nowCart) => {
    return nowCart.reduce(
      (accumulator, current) => {
        let disc = 0;

        if (current.cnt >= 10) {
          if (current.id === "p1") disc = 0.1;
          else if (current.id === "p2") disc = 0.15;
          else if (current.id === "p3") disc = 0.2;
        }
        const optionTotalCost = current.cost * current.cnt;

        return {
          nowTotalCost: accumulator.nowTotalCost + optionTotalCost,
          dcTotalCost: accumulator.dcTotalCost + optionTotalCost * (1 - disc),
          totalCnt: accumulator.totalCnt + current.cnt,
        };
      },
      {
        nowTotalCost: 0,
        dcTotalCost: 0,
        totalCnt: 0,
      }
    );
  };

  const calcurateDiscount = (nowTotalCost, dcTotalCost, totalCnt) => {
    let dc = 0;
    let finalDcTotalCost = dcTotalCost;

    if (totalCnt >= 30) {
      const bulkDiscount = dcTotalCost * 0.25;
      const individualDiscount = nowTotalCost - dcTotalCost;
      if (bulkDiscount > individualDiscount) {
        finalDcTotalCost = nowTotalCost * 0.75;
        dc = 0.25;
      } else dc = (nowTotalCost - dcTotalCost) / nowTotalCost;
    } else dc = (nowTotalCost - dcTotalCost) / nowTotalCost;

    return {
      conclusedTotalCost: Math.round(finalDcTotalCost),
      totalDc: (dc * 100).toFixed(1),
    };
  };

  const handleSelectChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    setSelectedOption(selectedIndex);
  };

  const MinusButton = ({ index }) => {
    return (
      <button
        className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
        onClick={() => {
          setCart((prev) => {
            const next = [...prev];
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
    );
  };

  const PlusButton = ({ index }) => {
    return (
      <button
        className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
        onClick={() => {
          setCart((prev) => {
            const next = [...prev];
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
    );
  };

  const DeleteButton = ({ index }) => {
    return (
      <button
        className="remove-item bg-red-500 text-white px-2 py-1 rounded"
        onClick={() => {
          setCart((prev) => {
            const next = [...prev];
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
    );
  };

  const Item = ({ item, key }) => {
    const index = OPTIONS.findIndex((option) => option.id === item.id);

    return (
      <div className="flex justify-between items-center mb-2" key={key}>
        <span>
          {item.name} - {item.cost}원 x {item.cnt}
        </span>
        <div>
          <MinusButton index={index} />
          <PlusButton index={index} />
          <DeleteButton index={index} />
        </div>
      </div>
    );
  };

  const CartAddButton = () => {
    return (
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
    );
  };

  const Option = ({ option }) => {
    return (
      <option
        value={option.id}
        key={`option${option.id}`}
        onChange={handleSelectChange}
      >
        {option.name} - {option.cost}원
      </option>
    );
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-div1-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-div1-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {cart.map((item) =>
            item.cnt > 0 ? <Item item={item} key={`item${item.id}`} /> : <></>
          )}
        </div>

        {totalCost > 0 && (
          <div id="cart-total" className="text-xl font-bold my-4">
            총액: {totalCost}원
            {discount > 0 && (
              <span class="text-green-500 ml-2">({discount}% 할인 적용)</span>
            )}
          </div>
        )}

        <select
          id="product-select"
          className="border rounded p-2 mr-2"
          onChange={handleSelectChange}
        >
          {OPTIONS.map((option) => (
            <Option option={option} />
          ))}
        </select>

        <CartAddButton />
      </div>
    </div>
  );
}

export default App;

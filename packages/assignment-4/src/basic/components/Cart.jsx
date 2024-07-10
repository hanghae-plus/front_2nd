import { OPTIONS } from "../constant";
import { Fragment } from "react";

export default function Cart({ cart, setCart }) {
  const Item = ({ item }) => {
    const index = OPTIONS.findIndex((option) => option.id === item.id);

    return (
      <div className="flex justify-between items-center mb-2">
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

  return (
    <div id="cart-items">
      {cart.map((item) =>
        item.cnt > 0 ? (
          <Item item={item} key={`item${item.id}`} />
        ) : (
          <Fragment key={`item${item.id}`} />
        )
      )}
    </div>
  );
}

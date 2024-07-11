import { useContext } from 'react';
import { ItemListContext, SetItemListContext } from '../contexts';
import { hasItemInCart, isOneItem } from '../utils';
import { ADD_QUANTITY } from '../constants';

export default function CartItem({ item, addToCart }) {
  const itemList = useContext(ItemListContext);
  const setItemList = useContext(SetItemListContext);

  function plusItem(id) {
    addToCart(id);
  }

  function minusItem(id) {
    if (!hasItemInCart(itemList, id)) {
      return;
    }
    if (isOneItem(itemList, id)) {
      deleteItem(id);
      return;
    }
    const newItemList = itemList.map((item) => {
      if (item.id === id) item.quantity -= ADD_QUANTITY;
      return item;
    });
    setItemList(newItemList);
  }

  function deleteItem(id) {
    const newItemList = itemList
      .map((item) => {
        if (item.id === id) {
          item.quantity = 0;
        }
        return item;
      })
      .filter((item) => item.id !== id);
    setItemList(newItemList);
  }

  return (
    <div id={item.id} className="flex justify-between items-center mb-2">
      <span>{`${item.name} - ${item.price}원 x ${item.quantity}`}</span>
      <div>
        <button
          onClick={() => minusItem(item.id)}
          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
        >
          -
        </button>
        <button
          onClick={() => plusItem(item.id)}
          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
        >
          +
        </button>
        <button
          onClick={() => deleteItem(item.id)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default function CartItem({ item, modifyCart }) {
  const { plusItem, minusItem, deleteItem } = modifyCart();

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

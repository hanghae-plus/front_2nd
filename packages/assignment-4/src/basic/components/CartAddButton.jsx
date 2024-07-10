export default function CartAddButton({ setCart, selectedOptionId }) {
  return (
    <button
      id="add-to-cart"
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={() => {
        setCart((prev) =>
          prev.map((item) =>
            item.id === selectedOptionId ? { ...item, cnt: item.cnt + 1 } : item
          )
        );
      }}
    >
      추가
    </button>
  );
}

export default function AddButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      id="add-to-cart"
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      {children}
    </button>
  );
}

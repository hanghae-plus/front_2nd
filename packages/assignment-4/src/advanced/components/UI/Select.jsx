export default function Select({ children, onChange }) {
  return (
    <select
      onChange={onChange}
      id="product-select"
      className="border rounded p-2 mr-2"
    >
      {children}
    </select>
  );
}

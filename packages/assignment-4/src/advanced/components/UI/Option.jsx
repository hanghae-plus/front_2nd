export default function Option({ product }) {
  return (
    <option key={product.id} value={product.id}>
      {`${product.name} - ${product.price}원`}
    </option>
  );
}

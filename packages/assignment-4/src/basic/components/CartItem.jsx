export default function CartItem({ key, item }) {
  console.log(key);
  return (
    <div
      key={key}
      id={item.id}
      className="flex justify-between items-center mb-2"
    >
      <span>{`${item.name} - ${item.price}원 x ${item.quantity}`}</span>
    </div>
  );
}

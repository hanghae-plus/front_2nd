import { CartItem } from "../../../types";

interface CartItemListProps {
  item: CartItem;
  appliedDiscountRate: number;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
}

const CartItemList = ({
  item,
  appliedDiscountRate,
  updateQuantity,
  removeFromCart,
}: CartItemListProps) => {
  /**
   * 수량을 변경하는 버튼 이벤트 핸들러
   * @param productId
   * @param newQuantity
   */
  const changeQuantityHandler = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  /**
   * 카트에서 제거하는 함수
   * @param productId
   */
  const removeFromCartHandler = (productId: string) => {
    removeFromCart(productId);
  };

  return (
    <div
      key={item.product.id}
      className="flex justify-between items-center bg-white p-3 rounded shadow"
    >
      <div>
        <span className="font-semibold">{item.product.name}</span>
        <br />
        <span className="text-sm text-gray-600">
          {item.product.price}원 x {item.quantity}
          {appliedDiscountRate > 0 && (
            <span className="text-green-600 ml-1">
              ({(appliedDiscountRate * 100).toFixed(0)}% 할인 적용)
            </span>
          )}
        </span>
      </div>
      <div>
        <button
          onClick={() =>
            changeQuantityHandler(item.product.id, item.quantity - 1)
          }
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          -
        </button>
        <button
          onClick={() =>
            changeQuantityHandler(item.product.id, item.quantity + 1)
          }
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          +
        </button>
        <button
          onClick={() => removeFromCartHandler(item.product.id)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItemList;

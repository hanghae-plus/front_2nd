import { Discount, InputEventHandler, Product } from "@/types";

interface Props {
  editingProduct: Product;
  newDiscount: Discount;
  onChangeName: InputEventHandler;
  onChangePrice: InputEventHandler;
  onChangeStock: InputEventHandler;
  onClickRemoveDiscount: (index: number) => void;
  onChangeDiscountQuantity: InputEventHandler;
  onChangeDiscountRate: InputEventHandler;
  onClickAddDiscount: () => void;
  onClickEditComplete: () => void;
}
const ProductEditingFormView = ({
  editingProduct,
  newDiscount,
  onChangeName,
  onChangePrice,
  onChangeStock,
  onClickRemoveDiscount,
  onChangeDiscountQuantity,
  onChangeDiscountRate,
  onClickAddDiscount,
  onClickEditComplete,
}: Props) => {
  return (
    <div>
      <ProductInformEditingForm
        editingProduct={editingProduct}
        onChangeName={onChangeName}
        onChangePrice={onChangePrice}
        onChangeStock={onChangeStock}
      />
      <ProductDiscountInformEditingForm
        editingProduct={editingProduct}
        newDiscount={newDiscount}
        onClickRemoveDiscount={onClickRemoveDiscount}
        onChangeDiscountQuantity={onChangeDiscountQuantity}
        onChangeDiscountRate={onChangeDiscountRate}
        onClickAddDiscount={onClickAddDiscount}
      />
      <button
        onClick={onClickEditComplete}
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </button>
    </div>
  );
};

interface ProductInformEditingFormProps {
  editingProduct: Product;
  onChangeName: InputEventHandler;
  onChangePrice: InputEventHandler;
  onChangeStock: InputEventHandler;
}
const ProductInformEditingForm = ({
  editingProduct,
  onChangeName,
  onChangePrice,
  onChangeStock,
}: ProductInformEditingFormProps) => {
  return (
    <>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={editingProduct.name}
          onChange={onChangeName}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          value={editingProduct.price}
          onChange={onChangePrice}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <input
          type="number"
          value={editingProduct.stock}
          onChange={onChangeStock}
          className="w-full p-2 border rounded"
        />
      </div>
    </>
  );
};

interface ProductDiscountInformEditingFormProps {
  editingProduct: Product;
  newDiscount: Discount;
  onClickRemoveDiscount: (index: number) => void;
  onChangeDiscountQuantity: InputEventHandler;
  onChangeDiscountRate: InputEventHandler;
  onClickAddDiscount: () => void;
}
const ProductDiscountInformEditingForm = ({
  editingProduct,
  newDiscount,
  onClickRemoveDiscount,
  onChangeDiscountQuantity,
  onChangeDiscountRate,
  onClickAddDiscount,
}: ProductDiscountInformEditingFormProps) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
      {editingProduct.discounts.map((discount, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          <span>
            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
          </span>
          <button
            onClick={() => onClickRemoveDiscount(index)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      ))}
      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="수량"
          value={newDiscount.quantity}
          onChange={onChangeDiscountQuantity}
          className="w-1/3 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="할인율 (%)"
          value={newDiscount.rate * 100}
          onChange={onChangeDiscountRate}
          className="w-1/3 p-2 border rounded"
        />
        <button
          onClick={onClickAddDiscount}
          className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          할인 추가
        </button>
      </div>
    </div>
  );
};
export default ProductEditingFormView;

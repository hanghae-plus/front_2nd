import { InputEventHandler, Product } from "@/types";

interface Props {
  newProduct: Omit<Product, "id">;
  onChangeName: InputEventHandler;
  onChangeStock: InputEventHandler;
  onChangePrice: InputEventHandler;
  onClickAddNewProduct: () => void;
}
const NewProductFormCardView = ({
  newProduct,
  onChangeName,
  onChangePrice,
  onChangeStock,
  onClickAddNewProduct,
}: Props) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
      <div className="mb-2">
        <label
          htmlFor="productName"
          className="block text-sm font-medium text-gray-700"
        >
          상품명
        </label>
        <input
          id="productName"
          type="text"
          value={newProduct.name}
          onChange={onChangeName}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="productPrice"
          className="block text-sm font-medium text-gray-700"
        >
          가격
        </label>
        <input
          id="productPrice"
          type="number"
          value={newProduct.price}
          onChange={onChangePrice}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="productStock"
          className="block text-sm font-medium text-gray-700"
        >
          재고
        </label>
        <input
          id="productStock"
          type="number"
          value={newProduct.stock}
          onChange={onChangeStock}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={onClickAddNewProduct}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        추가
      </button>
    </div>
  );
};

export default NewProductFormCardView;

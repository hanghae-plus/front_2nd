import useProductForm from "@/refactoring/hooks/useProductForm";

interface Props {
  productForm: ReturnType<typeof useProductForm>;
}
const NewProductFormCardView = ({ productForm }: Props) => {
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
          value={productForm.productForm.name}
          onChange={productForm.onChangeName}
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
          value={productForm.productForm.price}
          onChange={productForm.onChangePrice}
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
          value={productForm.productForm.stock}
          onChange={productForm.onChangeStock}
          className="w-full p-2 border rounded"
        />
      </div>
      {productForm.errorMessage && (
        <div className="text-red-500 text-sm mb-2">
          {productForm.errorMessage}
        </div>
      )}
      <button
        onClick={productForm.submitEditingProduct}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        추가
      </button>
    </div>
  );
};

export default NewProductFormCardView;

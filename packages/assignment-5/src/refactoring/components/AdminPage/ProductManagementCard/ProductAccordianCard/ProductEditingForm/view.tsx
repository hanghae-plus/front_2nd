import useDiscountForm from "@/refactoring/hooks/useDiscountForm";
import useProductForm from "@/refactoring/hooks/useProductForm";
import { Product } from "@/types";

interface Props {
  productForm: ReturnType<typeof useProductForm>;
  discountForm: ReturnType<typeof useDiscountForm>;
}
const ProductEditingFormView = ({ productForm, discountForm }: Props) => {
  return (
    <div>
      <ProductInformEditingForm productForm={productForm} />
      <ProductDiscountInformEditingForm
        editingProduct={productForm.editingProduct}
        discountForm={discountForm}
      />
      <button
        onClick={productForm.submitEditingProduct}
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </button>
    </div>
  );
};

interface ProductInformEditingFormProps {
  productForm: ReturnType<typeof useProductForm>;
}
const ProductInformEditingForm = ({
  productForm,
}: ProductInformEditingFormProps) => {
  return (
    <>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={productForm.productForm.name}
          onChange={productForm.onChangeName}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          value={productForm.productForm.price}
          onChange={productForm.onChangePrice}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <input
          type="number"
          value={productForm.productForm.stock}
          onChange={productForm.onChangeStock}
          className="w-full p-2 border rounded"
        />
      </div>
    </>
  );
};

interface ProductDiscountInformEditingFormProps {
  editingProduct: Product;
  discountForm: ReturnType<typeof useDiscountForm>;
}
const ProductDiscountInformEditingForm = ({
  editingProduct,
  discountForm,
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
            onClick={() => discountForm.onClickRemoveDiscount(index)}
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
          value={discountForm.discountForm.quantity}
          onChange={discountForm.onChangeDiscountQuantity}
          className="w-1/3 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="할인율 (%)"
          value={discountForm.discountForm.rate}
          onChange={discountForm.onChangeDiscountRate}
          className="w-1/3 p-2 border rounded"
        />
        <button
          onClick={discountForm.onClickAddDiscount}
          className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          할인 추가
        </button>
      </div>
      {discountForm.errorMessage && (
        <span className="text-red-500 text-sm">
          {discountForm.errorMessage}
        </span>
      )}
    </div>
  );
};
export default ProductEditingFormView;

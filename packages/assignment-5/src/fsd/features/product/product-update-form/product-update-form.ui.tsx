import { ChangeEvent, useState } from 'react';
import { useStore } from 'zustand';
import { Discount, INIT_DISCOUNT, Product, productStore } from '~entities';
import { generateRandomId } from '~shared';

type ProductUpdateFormProps = {
  initEditingProduct: Product;
  handleEditProduct: (editProduct: Product | null) => void;
};

export function ProductUpdateForm({
  initEditingProduct,
  handleEditProduct,
}: ProductUpdateFormProps) {
  const updateProduct = useStore(productStore, (state) => state.updateProduct);

  const [editingProduct, setEditingProduct] =
    useState<Product>(initEditingProduct);

  const [newDiscount, setNewDiscount] = useState<Discount>({
    id: generateRandomId(Date.now()),
    ...INIT_DISCOUNT,
  });

  const handleUpdateProduct = (
    e: ChangeEvent<HTMLInputElement>,
    type: keyof Product
  ) => {
    const newValue =
      e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setEditingProduct((prev) => ({
      ...prev,
      [type]: newValue,
    }));
  };

  const handleUpdateDiscount = (
    e: ChangeEvent<HTMLInputElement>,
    type: keyof Discount
  ) => {
    let newValue = parseInt(e.target.value);
    if (type === 'rate') {
      newValue /= 100;
    }
    setNewDiscount((prev) => ({
      ...prev,
      [type]: newValue,
    }));
  };

  const handleDeleteDiscount = (deleteDiscountId: string) => {
    setEditingProduct((prev) => ({
      ...prev,
      discounts: prev.discounts.filter(
        (discount) => discount.id !== deleteDiscountId
      ),
    }));
  };

  const handleAddDiscount = () => {
    setEditingProduct((prev) => ({
      ...prev,
      discounts: [...prev.discounts, newDiscount],
    }));
    setNewDiscount({
      id: generateRandomId(Date.now()),
      ...INIT_DISCOUNT,
    });
  };

  const handleEditComplete = () => {
    updateProduct(editingProduct);
    handleEditProduct(null);
  };

  const props: ProductUpdateFormViewProps = {
    editingProduct: editingProduct,
    newDiscount: newDiscount,
    handleUpdateProduct: handleUpdateProduct,
    handleUpdateDiscount: handleUpdateDiscount,
    handleDeleteDiscount: handleDeleteDiscount,
    handleAddDiscount: handleAddDiscount,
    handleEditComplete: handleEditComplete,
  };

  return <ProductUpdateFormView {...props} />;
}

type ProductUpdateFormViewProps = {
  editingProduct: Product;
  newDiscount: Discount;
  handleUpdateProduct: (
    e: ChangeEvent<HTMLInputElement>,
    type: keyof Product
  ) => void;
  handleUpdateDiscount: (
    e: ChangeEvent<HTMLInputElement>,
    type: keyof Discount
  ) => void;
  handleDeleteDiscount: (deleteDiscountId: string) => void;
  handleAddDiscount: () => void;
  handleEditComplete: () => void;
};

function ProductUpdateFormView({
  editingProduct,
  newDiscount,

  handleUpdateProduct,
  handleUpdateDiscount,
  handleDeleteDiscount,
  handleAddDiscount,
  handleEditComplete,
}: ProductUpdateFormViewProps) {
  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={editingProduct.name}
          onChange={(e) => handleUpdateProduct(e, 'name')}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          value={editingProduct.price}
          onChange={(e) => handleUpdateProduct(e, 'price')}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <input
          type="number"
          value={editingProduct.stock}
          onChange={(e) => handleUpdateProduct(e, 'stock')}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
        {editingProduct.discounts.map((discount, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span>
              {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
            </span>
            <button
              onClick={() => handleDeleteDiscount(discount.id)}
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
            onChange={(e) => handleUpdateDiscount(e, 'quantity')}
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="할인율 (%)"
            value={newDiscount.rate * 100}
            onChange={(e) => handleUpdateDiscount(e, 'rate')}
            className="w-1/3 p-2 border rounded"
          />
          <button
            onClick={handleAddDiscount}
            className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            할인 추가
          </button>
        </div>
      </div>
      <button
        onClick={handleEditComplete}
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </button>
    </div>
  );
}

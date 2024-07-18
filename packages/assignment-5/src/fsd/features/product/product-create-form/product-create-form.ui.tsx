import { ChangeEvent, useState } from 'react';
import { useStore } from 'zustand';
import { INIT_NEW_PRODUCT, Product, productStore } from '~entities';
import { generateRandomId } from '~shared';

type ProductCreateFormProps = {
  onToggleNewForm: () => void;
};

export function ProductCreateForm({ onToggleNewForm }: ProductCreateFormProps) {
  const [newProduct, setNewProduct] = useState<Product>({
    ...INIT_NEW_PRODUCT,
    id: generateRandomId(Date.now()),
  });

  const addProduct = useStore(productStore, (state) => state.addProduct);

  const handleNewProduct = () => {
    addProduct(newProduct);
    onToggleNewForm();
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: keyof Product
  ) => {
    const newValue =
      e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setNewProduct((preState) => ({
      ...preState,
      [type]: newValue,
    }));
  };

  const props = {
    newProduct,

    handleNewProduct,
    handleInputChange,
  };

  return <ProductCreateFormView {...props} />;
}

type ProductCreateFormViewProps = {
  newProduct: Product;
  handleNewProduct: () => void;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement>,
    type: keyof Product
  ) => void;
};

const ProductCreateFormView = ({
  newProduct,
  handleNewProduct,
  handleInputChange,
}: ProductCreateFormViewProps) => {
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
          onChange={(e) => handleInputChange(e, 'name')}
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
          onChange={(e) => handleInputChange(e, 'price')}
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
          onChange={(e) => handleInputChange(e, 'stock')}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={handleNewProduct}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        추가
      </button>
    </div>
  );
};

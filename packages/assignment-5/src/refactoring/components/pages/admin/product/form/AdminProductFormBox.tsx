import { FC } from "react";
import { Product } from "../../../../../../types";
import AdminProductFromTemplate from "./AdminProductFromTemplate";

interface Props {
  item: Omit<Product, "id">;
  changeItem: (product: Omit<Product, "id">) => void;
  handleAddItem: () => void;
}

const AdminProductFormBox: FC<Props> = ({
  item,
  changeItem,
  handleAddItem,
}) => {
  const handleNewProductName = (e: React.ChangeEvent<HTMLInputElement>) =>
    changeItem({ ...item, name: e.target.value });

  const handleNewProductPrice = (e: React.ChangeEvent<HTMLInputElement>) =>
    changeItem({
      ...item,
      price: parseInt(e.target.value),
    });

  const handleNewProductStock = (e: React.ChangeEvent<HTMLInputElement>) =>
    changeItem({
      ...item,
      stock: parseInt(e.target.value),
    });

  return (
    <AdminProductFromTemplate
      ProductName={
        <input
          id="productName"
          type="text"
          value={item.name}
          onChange={handleNewProductName}
          className="w-full p-2 border rounded"
        />
      }
      ProductPrice={
        <input
          id="productPrice"
          type="number"
          value={item.price}
          onChange={handleNewProductPrice}
          className="w-full p-2 border rounded"
        />
      }
      ProductStock={
        <input
          id="productStock"
          type="number"
          value={item.stock}
          onChange={handleNewProductStock}
          className="w-full p-2 border rounded"
        />
      }
      AddButton={
        <button
          onClick={handleAddItem}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          추가
        </button>
      }
    />
  );
};

export default AdminProductFormBox;

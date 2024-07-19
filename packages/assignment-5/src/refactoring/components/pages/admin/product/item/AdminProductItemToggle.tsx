import { FC } from "react";
import { Product } from "../../../../../../types";

interface Props {
  item: Product;
  onClick: () => void;
}

const AdminProductItemToggle: FC<Props> = ({ item, onClick }) => {
  return (
    <button
      data-testid="toggle-button"
      onClick={onClick}
      className="w-full text-left font-semibold"
    >
      {item.name} - {item.price}원 (재고: {item.stock})
    </button>
  );
};

export default AdminProductItemToggle;

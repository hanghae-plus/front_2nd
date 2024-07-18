import { FC } from "react";

interface Props {
  onClick: () => void;
  text: string;
}

const ProductAddButton: FC<Props> = ({ onClick, text }) => {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
    >
      {text}
    </button>
  );
};

export default ProductAddButton;

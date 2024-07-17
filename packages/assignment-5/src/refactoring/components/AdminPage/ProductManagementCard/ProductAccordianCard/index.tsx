import { Product } from "@/types";
import { useState } from "react";
import ProductDiscountInform from "./ProductDiscountInform";
import ProductEditingForm from "./ProductEditingForm";

interface Props {
  product: Product;
  index: number;
  onProductUpdate: (updatedProduct: Product) => void;
}
const ProductAccordianCard = ({ product, index, onProductUpdate }: Props) => {
  const [isAccordianOpen, setIsAccordianOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleProductAccordion = () => {
    setIsAccordianOpen((prev) => !prev);
  };
  return (
    <div
      key={product.id}
      data-testid={`product-${index + 1}`}
      className="bg-white p-4 rounded shadow"
    >
      <button
        data-testid="toggle-button"
        onClick={toggleProductAccordion}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {isAccordianOpen && (
        <div className="mt-2">
          {isEditing ? (
            <ProductEditingForm
              product={product}
              onProductUpdate={onProductUpdate}
              setIsEditing={setIsEditing}
            />
          ) : (
            <ProductDiscountInform
              product={product}
              setIsEditing={setIsEditing}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProductAccordianCard;

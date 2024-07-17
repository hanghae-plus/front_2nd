import useToggle from "@/refactoring/hooks/useToggle";
import { Product } from "@/types";
import ProductDiscountInform from "./ProductDiscountInform";
import ProductEditingForm from "./ProductEditingForm";

interface Props {
  product: Product;
  index: number;
  onProductUpdate: (updatedProduct: Product) => void;
}
const ProductAccordianCard = ({ product, index, onProductUpdate }: Props) => {
  const [isAccordianOpen, toggleProductAccordion] = useToggle(false);
  const [isEditing, toggleIsEditing] = useToggle(false);

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
              toggleIsEditing={toggleIsEditing}
            />
          ) : (
            <ProductDiscountInform
              product={product}
              toggleIsEditing={toggleIsEditing}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProductAccordianCard;

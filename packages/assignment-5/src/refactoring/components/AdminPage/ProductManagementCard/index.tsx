import { Product } from "@/types";
import { useState } from "react";
import NewProductFormCard from "./NewProductFormCard";
import ProductAccordianCard from "./ProductAccordianCard";

interface Props {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
}

const ProductManagementCard = ({
  products,
  onProductUpdate,
  onProductAdd,
}: Props) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const onClickToggleNewProductForm = () =>
    setShowNewProductForm((prev) => !prev);
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
      <button
        onClick={onClickToggleNewProductForm}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? "취소" : "새 상품 추가"}
      </button>
      {showNewProductForm && (
        <NewProductFormCard
          onProductAdd={onProductAdd}
          setShowNewProductForm={setShowNewProductForm}
        />
      )}
      <div className="space-y-2">
        {products.map((product, index) => (
          <ProductAccordianCard
            key={product.id}
            product={product}
            index={index}
            onProductUpdate={onProductUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductManagementCard;

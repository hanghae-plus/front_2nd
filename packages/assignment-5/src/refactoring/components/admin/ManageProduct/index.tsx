import { useState } from "react";
import type { Discount, Product } from "types";
import AddNewProduct from "./AddNewProduct";
import ProductItem from "./ProductItem";

interface ManageProductProps {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onAddProduct: (newProduct: Product) => void;
}

const ManageProduct = ({
  products,
  onProductUpdate,
  onAddProduct,
}: ManageProductProps) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    rate: 0,
    quantity: 0,
  });
  // 상품 추가 페이지

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리!!</h2>

      <button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? "취소" : "새 상품 추가"}
      </button>

      {showNewProductForm && (
        <AddNewProduct
          onAddProduct={onAddProduct}
          setShowNewProductForm={setShowNewProductForm}
        />
      )}

      {/* 상품 정보 */}
      <div className="space-y-2">
        {products.map((product, index) => (
          <ProductItem
            key={product.id}
            products={products}
            onProductUpdate={onProductUpdate}
            product={product}
            index={index}
            openProductIds={openProductIds}
            setOpenProductIds={setOpenProductIds}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            newDiscount={newDiscount}
            setNewDiscount={setNewDiscount}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageProduct;

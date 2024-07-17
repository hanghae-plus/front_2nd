import { useState } from "react";

import AddNewProduct from "./AddNewProduct";
import ProductItem from "./ProductItem";

import { useProductContext } from "provider/product/useProductContext";

const ManageProduct = () => {
  const { products } = useProductContext();

  const [showNewProductForm, setShowNewProductForm] = useState(false);

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
        <AddNewProduct setShowNewProductForm={setShowNewProductForm} />
      )}

      {/* 상품 정보 */}
      <div className="space-y-2">
        {products.map((product, index) => (
          <ProductItem key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ManageProduct;

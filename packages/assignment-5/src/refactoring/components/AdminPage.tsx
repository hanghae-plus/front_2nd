import { useState } from "react";
import { Coupon, Product } from "../../types.ts";
import { ProductInfo, ProductForm } from "../parts";
import { CouponForm } from "../parts/CouponForm.tsx";

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (productData: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({
  products,
  coupons,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: Props) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const handleAddNewProduct = (newProduct: Omit<Product, "id">) => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setShowNewProductForm(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          <button
            onClick={() => setShowNewProductForm(!showNewProductForm)}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
          >
            {showNewProductForm ? "취소" : "새 상품 추가"}
          </button>
          {showNewProductForm && (
            <ProductForm addNewProduct={handleAddNewProduct} />
          )}
          <div className="space-y-2">
            {products.map((product, index) => (
              <ProductInfo
                key={product.id}
                product={product}
                productIndex={index}
                updateProduct={onProductUpdate}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
          <CouponForm addNewCoupon={onCouponAdd}>
            <div>
              <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
              <div className="space-y-2">
                {coupons.map((coupon, index) => (
                  <div
                    key={index}
                    data-testid={`coupon-${index + 1}`}
                    className="bg-gray-100 p-2 rounded"
                  >
                    {coupon.name} ({coupon.code}):
                    {coupon.discountType === "amount"
                      ? `${coupon.discountValue}원`
                      : `${coupon.discountValue}%`}{" "}
                    할인
                  </div>
                ))}
              </div>
            </div>
          </CouponForm>
        </div>
      </div>
    </div>
  );
};

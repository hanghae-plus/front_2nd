import { useState } from 'react';
import { Coupon, Product, productStore, couponStore } from '~entities';
import {
  CouponForm,
  CouponList,
  ProductCreateForm,
  ProductUpdateForm,
} from '~features';
import { useStore } from 'zustand';

export const AdminPage = () => {
  const products = useStore(productStore, (state) => state.products);
  const coupons = useStore(couponStore, (state) => state.coupons);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedProductIds, setExpandedProductIds] = useState(
    new Set<string>()
  );
  const [showNewForm, setShowNewForm] = useState(false);

  const handleToggleNewForm = () => {
    setShowNewForm((preState) => !preState);
  };

  const handleToggleExpandProduct = (productId: string) => {
    setExpandedProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleEditProduct = (editProduct: Product | null) => {
    setEditingProduct(editProduct);
  };

  const props = {
    products,
    coupons,
    showNewForm,

    editingProduct,
    expandedProductIds,

    handleToggleNewForm,
    handleToggleExpandProduct,
    handleEditProduct,
  };

  return <AdminPageView {...props} />;
};

type AdminPageViewProps = {
  products: Product[];
  coupons: Coupon[];
  showNewForm: boolean;

  editingProduct: Product | null;
  expandedProductIds: Set<string>;

  handleToggleNewForm: () => void;
  handleToggleExpandProduct: (productId: string) => void;
  handleEditProduct: (editProduct: Product | null) => void;
};

function AdminPageView({
  products,
  coupons,
  showNewForm,

  editingProduct,
  expandedProductIds,

  handleToggleNewForm,
  handleToggleExpandProduct,
  handleEditProduct,
}: AdminPageViewProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          <button
            onClick={handleToggleNewForm}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
          >
            {showNewForm ? '취소' : '새 상품 추가'}
          </button>

          {showNewForm ? (
            <ProductCreateForm onToggleNewForm={handleToggleNewForm} />
          ) : null}
          <div className="space-y-2">
            {products.map((product, index) => (
              <div
                key={product.id}
                data-testid={`product-${index + 1}`}
                className="bg-white p-4 rounded shadow"
              >
                <button
                  data-testid="toggle-button"
                  onClick={() => handleToggleExpandProduct(product.id)}
                  className="w-full text-left font-semibold"
                >
                  {product.name} - {product.price}원 (재고: {product.stock})
                </button>

                {expandedProductIds.has(product.id) && (
                  <div className="mt-2">
                    {editingProduct && editingProduct.id === product.id ? (
                      <ProductUpdateForm
                        initEditingProduct={editingProduct}
                        handleEditProduct={handleEditProduct}
                      />
                    ) : (
                      <div>
                        {product.discounts.map((discount, index) => (
                          <div key={index} className="mb-2">
                            <span>
                              {discount.quantity}개 이상 구매 시{' '}
                              {discount.rate * 100}% 할인
                            </span>
                          </div>
                        ))}
                        <button
                          data-testid="modify-button"
                          onClick={() => handleEditProduct(product)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
                        >
                          수정
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
          <div className="bg-white p-4 rounded shadow">
            <div className="space-y-2 mb-4">
              <CouponForm />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
              <CouponList coupons={coupons} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

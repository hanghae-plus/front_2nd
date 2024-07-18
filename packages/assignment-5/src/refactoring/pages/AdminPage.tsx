import type { Coupon, Product } from '../../types.ts';
import NewProductForm from '../components/admin/NewProductForm.tsx';
import { useOpenStatus } from '../hooks/useOpenStatus.ts';
import CouponManage from '../components/admin/CouponManage.tsx';
import { useProductAccordion } from '../hooks/useProductAccordion.ts';
import { useEditingProduct } from '../hooks/useEditingProduct.ts';
import { EditingProductForm } from '../components/admin/EditingProductForm.tsx';
import { DiscountForm } from '../components/admin/DiscountForm.tsx';
import { convertToPercentage } from '../hooks/utils/formatNumber.ts';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
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
  const { isOpen, onToggle } = useOpenStatus();
  const { openProductIds, toggleProductAccordion } = useProductAccordion();
  const {
    edit,
    editingProduct,
    editProperty,
    submit: editSubmit,
  } = useEditingProduct(products, onProductUpdate);

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
        <button
          onClick={onToggle}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
        >
          {isOpen ? '취소' : '새 상품 추가'}
        </button>

        {isOpen && <NewProductForm onAddNewProduct={onProductAdd} />}

        <div className="space-y-2">
          {products.map((product, index) => (
            <div
              key={product.id}
              data-testid={`product-${index + 1}`}
              className="bg-white p-4 rounded shadow"
            >
              <button
                data-testid="toggle-button"
                onClick={() => toggleProductAccordion(product.id)}
                className="w-full text-left font-semibold"
              >
                {product.name} - {product.price}원 (재고: {product.stock})
              </button>
              {openProductIds.has(product.id) && (
                <div className="mt-2">
                  {editingProduct && editingProduct.id === product.id ? (
                    <EditingProductForm
                      products={products}
                      editingProduct={editingProduct}
                      editProperty={editProperty}
                      submit={editSubmit}
                      onProductUpdate={onProductUpdate}
                    >
                      <DiscountForm
                        products={products}
                        productId={product.id}
                        onProductUpdate={onProductUpdate}
                      />
                    </EditingProductForm>
                  ) : (
                    <div>
                      {product.discounts.map((discount, index) => (
                        <div key={index} className="mb-2">
                          <span>
                            {discount.quantity}개 이상 구매 시{' '}
                            {convertToPercentage(discount.rate, 0)}% 할인
                          </span>
                        </div>
                      ))}
                      <button
                        data-testid="modify-button"
                        onClick={() => edit(product)}
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
      <CouponManage coupons={coupons} onCouponAdd={onCouponAdd} />
    </>
  );
};

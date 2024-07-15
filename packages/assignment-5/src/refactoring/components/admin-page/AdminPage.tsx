import { Coupon, Product } from '../../../types.ts';
import { useCouponForm, useDiscountForm, useEditingProduct, useProductAccordion, useProductForm } from "./hooks";

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}


export const AdminPage = ({ products, coupons, onProductUpdate, onProductAdd, onCouponAdd }: Props) => {
  const editing = useEditingProduct(onProductUpdate)
  const productForm = useProductForm(onProductAdd);
  const discountForm = useDiscountForm(onProductUpdate, { value: editing.value, edit: editing.edit });
  const couponForm = useCouponForm(onCouponAdd);
  const { openProductIds, toggleProductAccordion } = useProductAccordion();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          <button
            onClick={productForm.toggle}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
          >
            {productForm.enable ? '취소' : '새 상품 추가'}
          </button>
          {productForm.enable && (
            <div className="bg-white p-4 rounded shadow mb-4">
              <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
              <div className="mb-2">
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">상품명</label>
                <input
                  id="productName"
                  type="text"
                  value={productForm.newProduct.name}
                  onChange={(e) => productForm.setNewProduct({ ...productForm.newProduct, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">가격</label>
                <input
                  id="productPrice"
                  type="number"
                  value={productForm.newProduct.price}
                  onChange={(e) => productForm.setNewProduct({
                    ...productForm.newProduct,
                    price: parseInt(e.target.value)
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">재고</label>
                <input
                  id="productStock"
                  type="number"
                  value={productForm.newProduct.stock}
                  onChange={(e) => productForm.setNewProduct({
                    ...productForm.newProduct,
                    stock: parseInt(e.target.value)
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                onClick={productForm.submit}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                추가
              </button>
            </div>
          )}
          <div className="space-y-2">
            {products.map((product, index) => (
              <div key={product.id} data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
                <button
                  data-testid="toggle-button"
                  onClick={() => toggleProductAccordion(product.id)}
                  className="w-full text-left font-semibold"
                >
                  {product.name} - {product.price}원 (재고: {product.stock})
                </button>
                {openProductIds.has(product.id) && (
                  <div className="mt-2">
                    {editing.value && editing.value.id === product.id ? (
                      <div>
                        <div className="mb-4">
                          <label className="block mb-1">상품명: </label>
                          <input
                            type="text"
                            value={editing.value.name}
                            onChange={(e) => editing.editProperty('name', e.target.value)}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block mb-1">가격: </label>
                          <input
                            type="number"
                            value={editing.value.price}
                            onChange={(e) => editing.editProperty('price', parseInt(e.target.value))}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block mb-1">재고: </label>
                          <input
                            type="number"
                            value={editing.value.stock}
                            onChange={(e) => editing.editProperty('stock', parseInt(e.target.value))}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        {/* 할인 정보 수정 부분 */}
                        <div>
                          <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                          {editing.value.discounts.map((discount, index) => (
                            <div key={index} className="flex justify-between items-center mb-2">
                              <span>{discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인</span>
                              <button
                                onClick={() => discountForm.remove(product, index)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              >
                                삭제
                              </button>
                            </div>
                          ))}
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              placeholder="수량"
                              value={discountForm.newDiscount.quantity}
                              onChange={(e) => discountForm.setNewDiscount({
                                ...discountForm.newDiscount,
                                quantity: parseInt(e.target.value)
                              })}
                              className="w-1/3 p-2 border rounded"
                            />
                            <input
                              type="number"
                              placeholder="할인율 (%)"
                              value={discountForm.newDiscount.rate * 100}
                              onChange={(e) => discountForm.setNewDiscount({
                                ...discountForm.newDiscount,
                                rate: parseInt(e.target.value) / 100
                              })}
                              className="w-1/3 p-2 border rounded"
                            />
                            <button
                              onClick={() => discountForm.add(product)}
                              className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                              할인 추가
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={editing.submit}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
                        >
                          수정 완료
                        </button>
                      </div>
                    ) : (
                      <div>
                        {product.discounts.map((discount, index) => (
                          <div key={index} className="mb-2">
                            <span>{discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인</span>
                          </div>
                        ))}
                        <button
                          data-testid="modify-button"
                          onClick={() => editing.edit(product)}
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
              <input
                type="text"
                placeholder="쿠폰 이름"
                value={couponForm.value.name}
                onChange={(e) => couponForm.edit({ ...couponForm.value, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="쿠폰 코드"
                value={couponForm.value.code}
                onChange={(e) => couponForm.edit({ ...couponForm.value, code: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2">
                <select
                  value={couponForm.value.discountType}
                  onChange={(e) => couponForm.edit({
                    ...couponForm.value,
                    discountType: e.target.value as 'amount' | 'percentage'
                  })}
                  className="w-full p-2 border rounded"
                >
                  <option value="amount">금액(원)</option>
                  <option value="percentage">할인율(%)</option>
                </select>
                <input
                  type="number"
                  placeholder="할인 값"
                  value={couponForm.value.discountValue}
                  onChange={(e) => couponForm.edit({ ...couponForm.value, discountValue: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                onClick={couponForm.submit}
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                쿠폰 추가
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
              <div className="space-y-2">
                {coupons.map((coupon, index) => (
                  <div key={index} data-testid={`coupon-${index + 1}`} className="bg-gray-100 p-2 rounded">
                    {coupon.name} ({coupon.code}):
                    {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`} 할인
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Coupon, Discount, Product } from '../../types.ts';
import { useAdmin } from '../hooks/useAdmin.ts';

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
  const {
    editingProduct,
    newDiscount,
    newCoupon,
    newProduct,
    showNewProductForm,

    handleEditProduct,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleEditComplete,
    handleAddCoupon,
    handleAddNewCouponByName,
    handleAddNewCouponByCode,
    handleAddNewCouponByDiscountType,
    handleAddNewProduct,
    handleStockUpdate,
    handleAddDiscount,
    handleRemoveDiscount,
    handleAddQuantityDiscount,
    handleAddPercentDiscount,
    handleOnChangeNewProduct,
    handleOnChangeNewProductPrice,
    handleOnChangeNewProductStock,
    toggleNewProductForm,
    handleOnChangeDiscountValue,
  } = useAdmin(products, onProductUpdate, onProductAdd, onCouponAdd);

  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const adminProductProps = {
    openProductIds,
    newDiscount,
    toggleProductAccordion,
    handleEditProduct,
    handlePriceUpdate,
    handleEditComplete,
    handleStockUpdate,
    handleAddDiscount,
    handleRemoveDiscount,
    handleAddCoupon,
    handleAddNewProduct,
    handleProductNameUpdate,
    handleAddQuantityDiscount,
    handleAddPercentDiscount,
  };

  const adminCouponAddFormProp: AdminCouponAddFormProp = {
    coupons,
    newCoupon,
    handleAddCoupon,
    handleAddNewCouponByName,
    handleAddNewCouponByCode,
    handleAddNewCouponByDiscountType,
    handleOnChangeDiscountValue,
  };

  const adminProductAddFormProps = {
    handleOnChangeNewProduct,
    newProduct,
    handleAddNewProduct,
    handleOnChangeNewProductPrice,
    handleOnChangeNewProductStock,
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          <button
            onClick={toggleNewProductForm}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
          >
            {showNewProductForm ? '취소' : '새 상품 추가'}
          </button>
          {showNewProductForm && (
            <AdminProductAddFormView {...adminProductAddFormProps} />
          )}
          <div className="space-y-2">
            {products.map((product, index) => (
              <AdminProductView
                key={index}
                editingProduct={editingProduct}
                product={product}
                index={index}
                {...adminProductProps}
              />
            ))}
          </div>
        </div>
        {/* 쿠폰 관리 */}
        <AdminCouponAddFormView {...adminCouponAddFormProp} />
      </div>
    </div>
  );
};

type AdminProductAddFormProp = {
  newProduct: Omit<Product, 'id'>;
  handleAddNewProduct: () => void;
  handleOnChangeNewProduct: (name: string) => void;
  handleOnChangeNewProductPrice: (price: number) => void;
  handleOnChangeNewProductStock: (stock: number) => void;
};

const AdminProductAddFormView = ({
  newProduct,
  handleAddNewProduct,
  handleOnChangeNewProduct,
  handleOnChangeNewProductPrice,
  handleOnChangeNewProductStock,
}: AdminProductAddFormProp) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>

      {/* 상품 추가 폼. */}
      <div className="mb-2">
        <label
          htmlFor="productName"
          className="block text-sm font-medium text-gray-700"
        >
          상품명
        </label>
        <input
          id="productName"
          type="text"
          value={newProduct.name}
          onChange={(e) => handleOnChangeNewProduct(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label
          htmlFor="productPrice"
          className="block text-sm font-medium text-gray-700"
        >
          가격
        </label>
        <input
          id="productPrice"
          type="number"
          value={newProduct.price}
          onChange={(e) =>
            handleOnChangeNewProductPrice(parseInt(e.target.value))
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="productStock"
          className="block text-sm font-medium text-gray-700"
        >
          재고
        </label>
        <input
          id="productStock"
          type="number"
          value={newProduct.stock}
          onChange={(e) =>
            handleOnChangeNewProductStock(parseInt(e.target.value))
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={handleAddNewProduct}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        추가
      </button>
    </div>
  );
};

type AdminCouponAddFormProp = {
  coupons: Coupon[];
  newCoupon: Coupon;
  handleAddCoupon: () => void;
  handleAddNewCouponByName: (name: string) => void;
  handleAddNewCouponByCode: (code: string) => void;
  handleAddNewCouponByDiscountType: (
    discountType: 'amount' | 'percentage',
  ) => void;
  handleOnChangeDiscountValue: (discountValue: number) => void;
};

const AdminCouponAddFormView = ({
  coupons,
  newCoupon,
  handleAddCoupon,
  handleAddNewCouponByName,
  handleAddNewCouponByCode,
  handleAddNewCouponByDiscountType,
  handleOnChangeDiscountValue,
}: AdminCouponAddFormProp) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <div className="space-y-2 mb-4">
          <input
            type="text"
            placeholder="쿠폰 이름"
            value={newCoupon.name}
            onChange={(e) => handleAddNewCouponByName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="쿠폰 코드"
            value={newCoupon.code}
            onChange={(e) => handleAddNewCouponByCode(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <select
              value={newCoupon.discountType}
              onChange={(e) =>
                handleAddNewCouponByDiscountType(
                  e.target.value as 'amount' | 'percentage',
                )
              }
              className="w-full p-2 border rounded"
            >
              <option value="amount">금액(원)</option>
              <option value="percentage">할인율(%)</option>
            </select>
            <input
              type="number"
              placeholder="할인 값"
              value={newCoupon.discountValue}
              onChange={(e) =>
                handleOnChangeDiscountValue(parseInt(e.target.value))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleAddCoupon}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            쿠폰 추가
          </button>
        </div>
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
                {coupon.discountType === 'amount'
                  ? `${coupon.discountValue}원`
                  : `${coupon.discountValue}%`}{' '}
                할인
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type AdminProductItemProps = {
  product: Product;
  toggleProductAccordion: (productId: string) => void;
};

const AdminProductItemView = ({
  product,
  toggleProductAccordion,
}: AdminProductItemProps) => {
  return (
    <button
      data-testid="toggle-button"
      onClick={() => toggleProductAccordion(product.id)}
      className="w-full text-left font-semibold"
    >
      {product.name} - {product.price}원 (재고: {product.stock})
    </button>
  );
};

type AdminProductEditFormProps = {
  product: Product;
  editingProduct: Product;
  handleProductNameUpdate: (productId: string, newName: string) => void;
  handlePriceUpdate: (productId: string, newPrice: number) => void;
  handleStockUpdate: (productId: string, newStock: number) => void;
};

const AdminProductEditFormView = ({
  product,
  editingProduct,
  handleProductNameUpdate,
  handlePriceUpdate,
  handleStockUpdate,
}: AdminProductEditFormProps) => {
  return (
    <>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={editingProduct.name}
          onChange={(e) => handleProductNameUpdate(product.id, e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          value={editingProduct.price}
          onChange={(e) =>
            handlePriceUpdate(product.id, parseInt(e.target.value))
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <input
          type="number"
          value={editingProduct.stock}
          onChange={(e) =>
            handleStockUpdate(product.id, parseInt(e.target.value))
          }
          className="w-full p-2 border rounded"
        />
      </div>
    </>
  );
};

type AdminProductDiscountInfoView = {
  discount: Discount;
};

const AdminProductDiscountInfoView = ({
  discount,
}: AdminProductDiscountInfoView) => {
  return (
    <span>
      {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
    </span>
  );
};

type AdminProductDiscountEditView = {
  product: Product;
  index: number;
  discount: Discount;
  handleRemoveDiscount: (productId: string, index: number) => void;
};

const AdminProductDiscountEditView = ({
  product,
  index,
  discount,
  handleRemoveDiscount,
}: AdminProductDiscountEditView) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <AdminProductDiscountInfoView discount={discount} />
      <button
        onClick={() => handleRemoveDiscount(product.id, index)}
        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      >
        삭제
      </button>
    </div>
  );
};

type AdminProductDiscountFormViewProps = {
  product: Product;
  newDiscount: Discount;
  handleAddDiscount: (productId: string) => void;
  handleAddQuantityDiscount: (quantity: number) => void;
  handleAddPercentDiscount: (rate: number) => void;
};

const AdminProductDiscountFormView = ({
  product,
  newDiscount,
  handleAddDiscount,
  handleAddQuantityDiscount,
  handleAddPercentDiscount,
}: AdminProductDiscountFormViewProps) => {
  return (
    <div className="flex space-x-2">
      <input
        type="number"
        placeholder="수량"
        value={newDiscount.quantity}
        onChange={(e) => handleAddQuantityDiscount(parseInt(e.target.value))}
        className="w-1/3 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="할인율 (%)"
        value={newDiscount.rate * 100}
        onChange={(e) =>
          handleAddPercentDiscount(parseInt(e.target.value) / 100)
        }
        className="w-1/3 p-2 border rounded"
      />
      <button
        onClick={() => handleAddDiscount(product.id)}
        className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        할인 추가
      </button>
    </div>
  );
};

type AdminProductViewProps = {
  product: Product;
  index: number;
  toggleProductAccordion: (productId: string) => void;
  openProductIds: Set<string>;
  editingProduct: Product | null;
  handleProductNameUpdate: (productId: string, newName: string) => void;
  handlePriceUpdate: (productId: string, newPrice: number) => void;
  handleStockUpdate: (productId: string, newStock: number) => void;
  handleRemoveDiscount: (productId: string, index: number) => void;
  newDiscount: Discount;

  handleAddDiscount: (productId: string) => void;
  handleEditComplete: () => void;
  handleEditProduct: (product: Product) => void;
  handleAddQuantityDiscount: (quantity: number) => void;
  handleAddPercentDiscount: (rate: number) => void;
};

const AdminProductView = ({
  product,
  index,
  toggleProductAccordion,
  openProductIds,
  editingProduct,
  handleProductNameUpdate,
  handlePriceUpdate,
  handleStockUpdate,
  handleRemoveDiscount,
  newDiscount,

  handleAddDiscount,
  handleEditComplete,
  handleEditProduct,
  handleAddQuantityDiscount,
  handleAddPercentDiscount,
}: AdminProductViewProps) => {
  return (
    <div
      key={product.id}
      data-testid={`product-${index + 1}`}
      className="bg-white p-4 rounded shadow"
    >
      <AdminProductItemView
        product={product}
        toggleProductAccordion={toggleProductAccordion}
      />

      {openProductIds.has(product.id) && (
        <div className="mt-2">
          {editingProduct && editingProduct.id === product.id ? (
            <div>
              <AdminProductEditFormView
                product={product}
                editingProduct={editingProduct}
                handleProductNameUpdate={handleProductNameUpdate}
                handlePriceUpdate={handlePriceUpdate}
                handleStockUpdate={handleStockUpdate}
              />
              {/* 할인 정보 수정 부분 */}
              <div>
                <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                {editingProduct.discounts.map((discount, index) => (
                  <AdminProductDiscountEditView
                    key={index}
                    product={product}
                    index={index}
                    discount={discount}
                    handleRemoveDiscount={handleRemoveDiscount}
                  />
                ))}
                <AdminProductDiscountFormView
                  product={product}
                  newDiscount={newDiscount}
                  handleAddDiscount={handleAddDiscount}
                  handleAddQuantityDiscount={handleAddQuantityDiscount}
                  handleAddPercentDiscount={handleAddPercentDiscount}
                />
              </div>
              <button
                onClick={handleEditComplete}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
              >
                수정 완료
              </button>
            </div>
          ) : (
            <div>
              {product.discounts.map((discount, index) => (
                <AdminProductDiscountInfoView key={index} discount={discount} />
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
  );
};

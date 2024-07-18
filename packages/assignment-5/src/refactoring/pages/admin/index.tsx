import CouponForm from './components/CouponForm';
import CouponList from './components/CouponList';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import { useProductManagement, useCouponManagement } from './hooks';

export const AdminPage = () => {
  const {
    products,
    openProductIds,
    editingProduct,
    newDiscount,
    showNewProductForm,
    newProduct,
    toggleProductAccordion,
    handleEditProduct,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleStockUpdate,
    handleEditComplete,
    handleAddDiscount,
    handleRemoveDiscount,
    setNewDiscount,
    setShowNewProductForm,
    setNewProduct,
    handleAddNewProduct
  } = useProductManagement();
  const couponManagement = useCouponManagement();

  const productEditHandlers = {
    handleProductNameUpdate,
    handlePriceUpdate,
    handleStockUpdate,
    handleAddDiscount,
    handleRemoveDiscount,
    handleEditComplete,
    setNewDiscount
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
            {showNewProductForm ? '취소' : '새 상품 추가'}
          </button>
          {showNewProductForm && (
            <ProductForm
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              handleAddNewProduct={handleAddNewProduct}
            />
          )}
          <ProductList
            products={products}
            openProductIds={openProductIds}
            editingProduct={editingProduct}
            newDiscount={newDiscount}
            toggleProductAccordion={toggleProductAccordion}
            handleEditProduct={handleEditProduct}
            productEditHandlers={productEditHandlers}
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
          <div className="bg-white p-4 rounded shadow">
            <CouponForm
              newCoupon={couponManagement.newCoupon}
              setNewCoupon={couponManagement.setNewCoupon}
              handleAddCoupon={couponManagement.handleAddCoupon}
            />
            <CouponList coupons={couponManagement.coupons} />
          </div>
        </div>
      </div>
    </div>
  );
};

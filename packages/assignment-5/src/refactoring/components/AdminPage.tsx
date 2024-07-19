import { Coupon, Product } from "../../types.ts";
import ProductAddButton from "./pages/admin/button/ProductAddButton.tsx";

import AdminProductListBox from "./pages/admin/product/list/AdminProductListBox.tsx";
import AdminProductFormBox from "./pages/admin/product/form/AdminProductFormBox.tsx";
import AdminCouponFormBox from "./pages/admin/coupon/form/AdminCouponFormBox.tsx";
import AdminCouponListBox from "./pages/admin/coupon/list/AdminCouponListBox.tsx";
import AdminPageTemplate from "./pages/admin/template/AdminPageTemplate.tsx";
import useEditingProduct from "../hooks/useEditingProduct.ts";
import { useProductForm } from "../hooks/useProductForm.ts";
import { useCouponForm } from "../hooks/useCouponForm.ts";

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
    newProduct,
    setNewProduct,
    showNewProductForm,
    addNewProduct,
    toggleProductForm,
  } = useProductForm(onProductAdd);

  const { editingProduct, edit, editProduct, submit } =
    useEditingProduct(onProductUpdate);

  const {
    coupon,
    changeItem: changeCoupon,
    submit: submitCoupon,
  } = useCouponForm(onCouponAdd);

  return (
    <AdminPageTemplate
      AddButton={
        <ProductAddButton
          onClick={toggleProductForm}
          text={showNewProductForm ? "취소" : "새 상품 추가"}
        />
      }
      ProductForm={
        showNewProductForm ? (
          <AdminProductFormBox
            item={newProduct}
            changeItem={setNewProduct}
            handleAddItem={addNewProduct}
          />
        ) : null
      }
      ProductList={
        <AdminProductListBox
          items={products}
          onProductUpdate={edit}
          editingProduct={editingProduct}
          onEditProperty={editProduct}
          onSubmit={submit}
        />
      }
      CouponForm={
        <AdminCouponFormBox
          item={coupon}
          changeItem={changeCoupon}
          handleAddItem={submitCoupon}
        />
      }
      CouponList={<AdminCouponListBox items={coupons} />}
    />
  );
};

import { FC, ReactElement } from "react";

interface Props {
  AddButton: ReactElement;
  ProductForm?: ReactElement | null;
  ProductList: ReactElement;
  CouponForm: ReactElement;
  CouponList: ReactElement;
}

const AdminPageTemplate: FC<Props> = ({
  AddButton,
  ProductForm,
  ProductList,
  CouponForm,
  CouponList,
}) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          {AddButton}
          {ProductForm}
          {ProductList}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
          <div className="bg-white p-4 rounded shadow">
            {CouponForm}
            <div>
              <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
              {CouponList}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPageTemplate;

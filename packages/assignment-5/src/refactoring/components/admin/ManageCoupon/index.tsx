import AddNewCoupon from "./AddNewCoupon";
import CouponList from "./CouponList";

const ManageCoupon = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <div className="space-y-2 mb-4">
          <AddNewCoupon />
        </div>
        <CouponList />
      </div>
    </div>
  );
};

export default ManageCoupon;

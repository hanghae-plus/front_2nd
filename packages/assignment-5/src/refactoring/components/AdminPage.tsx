import { Title } from './UI/common/Title.tsx';
import { ProductManaging } from './UI/adminPage/ProuductManaging/index.tsx';
import { CouponManaging } from './UI/adminPage/CouponManaging.tsx';

export const AdminPage = () => {
  return (
    <div className="container mx-auto p-4">
      <Title>관리자 페이지</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductManaging />
        <CouponManaging />
      </div>
    </div>
  );
};

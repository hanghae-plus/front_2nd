import { AdminPage } from '../../../pages/admin';
import CartPage from '../../../pages/cart';
import { useAdmin } from '../../hooks/useAdmin';

const Main = () => {
  const { isAdmin } = useAdmin();

  return <main className="container mx-auto mt-6">{isAdmin ? <AdminPage /> : <CartPage />}</main>;
};

export default Main;

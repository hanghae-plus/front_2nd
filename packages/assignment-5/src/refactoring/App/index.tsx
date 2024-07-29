import { useCoupons, useProducts } from "@/refactoring/hooks";
import useToggle from "../hooks/useToggle";
import AppView from "./view";

const App = () => {
  const { products, updateProduct, addProduct } = useProducts();
  const { coupons, addCoupon } = useCoupons();
  const [isAdmin, toggleIsAdmin] = useToggle(false);

  const props = {
    products,
    updateProduct,
    addProduct,
    coupons,
    addCoupon,
    isAdmin,
    toggleIsAdmin,
  };

  return <AppView {...props} />;
};

export default App;

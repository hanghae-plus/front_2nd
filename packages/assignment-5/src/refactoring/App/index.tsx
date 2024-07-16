import { useCoupons, useProducts } from "@/refactoring/hooks";
import { data as COUPONS } from "@/refactoring/mocks/coupons.json";
import { data as PRODUCTS } from "@/refactoring/mocks/products.json";
import { Coupon, Product } from "@/types.ts";
import { useState } from "react";
import AppView from "./view";

const App = () => {
  const { products, updateProduct, addProduct } = useProducts(
    PRODUCTS as Product[]
  );
  const { coupons, addCoupon } = useCoupons(COUPONS as Coupon[]);
  const [isAdmin, setIsAdmin] = useState(false);

  const props = {
    products,
    updateProduct,
    addProduct,
    coupons,
    addCoupon,
    isAdmin,
    setIsAdmin,
  };

  return <AppView {...props} />;
};

export default App;

import { useProductContext } from "provider/product/useProductContext";
import ProductItem from "./ProductItem";

const ProductList = (): JSX.Element => {
  const { products } = useProductContext();

  return (
    <>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </>
  );
};

export default ProductList;

import { Product } from "../../../types";
import { useCart } from "../../hooks";
import { useAddProductButtonProps } from "../../hooks/useAddProductButtonProps";
import { getRemainingStock } from "../../hooks/utils/productUtils";
import AddProductButton from "./AddProductButton";
import { ProductCard } from "./ProductCard";

interface ProductContainerProps {
  products: Product[];
}

export const ProductContainer = ({ products }: ProductContainerProps) => {
  const { cart, addToCart } = useCart();

  const handleAddProductButtonClick = (product: Product) => {
    addToCart(product);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <div className="space-y-2">
            {products.map((product) => {
              const remainingStock = getRemainingStock(cart, product);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  remainingStock={remainingStock}
                >
                  <AddProductButton
                    onClick={() => handleAddProductButtonClick(product)}
                    {...useAddProductButtonProps(remainingStock)}
                  />
                </ProductCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

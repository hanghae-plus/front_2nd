import useDiscountForm from "@/refactoring/hooks/useDiscountForm";
import useProductForm from "@/refactoring/hooks/useProductForm";
import { Product } from "@/types";
import ProductEditingFormView from "./view";

interface Props {
  onProductUpdate: (updatedProduct: Product) => void;
  product: Product;
  toggleIsEditing: () => void;
}
const ProductEditingForm = ({
  onProductUpdate,
  product,
  toggleIsEditing,
}: Props) => {
  const productFormCallback = (product: Product) => {
    onProductUpdate(product);
    toggleIsEditing();
  };

  const productForm = useProductForm(product, productFormCallback);
  const discountForm = useDiscountForm(productForm, onProductUpdate);

  const props = {
    productForm,
    discountForm,
  };
  return <ProductEditingFormView {...props} />;
};

export default ProductEditingForm;

import useProductForm from "@/refactoring/hooks/useProductForm";
import { generateNewDefaultProduct } from "@/refactoring/utils/generateNewDefaultProduct";
import { Product } from "@/types";
import NewProductFormCardView from "./view";
interface Props {
  onProductAdd: (newProduct: Product) => void;
  toggleNewProductForm: () => void;
}
const NewProductFormCard = ({ onProductAdd, toggleNewProductForm }: Props) => {
  const formCallback = (product: Product) => {
    onProductAdd(product);
    toggleNewProductForm();
  };

  const productForm = useProductForm(generateNewDefaultProduct(), formCallback);

  const props = {
    productForm,
  };

  return <NewProductFormCardView {...props} />;
};

export default NewProductFormCard;

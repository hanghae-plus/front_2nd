import useEditProductInform from "@/refactoring/hooks/useEditProductInform";
import { generateNewDefaultProduct } from "@/refactoring/utils/generateNewDefaultProduct";
import { Product } from "@/types";
import NewProductFormCardView from "./view";
interface Props {
  onProductAdd: (newProduct: Product) => void;
  toggleNewProductForm: () => void;
}
const NewProductFormCard = ({ onProductAdd, toggleNewProductForm }: Props) => {
  const editProductInform = useEditProductInform(generateNewDefaultProduct());

  const onClickAddNewProduct = () => {
    onProductAdd(editProductInform.editingProduct);
    editProductInform.setEditingProduct(generateNewDefaultProduct());
    toggleNewProductForm();
  };

  const props = {
    ...editProductInform,
    onClickAddNewProduct,
  };

  return <NewProductFormCardView {...props} />;
};

export default NewProductFormCard;

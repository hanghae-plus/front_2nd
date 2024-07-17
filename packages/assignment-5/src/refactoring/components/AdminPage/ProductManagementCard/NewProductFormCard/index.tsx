import useEditProductInform from "@/refactoring/hooks/useEditProductInform";
import { generateNewDefaultProduct } from "@/refactoring/utils/generateNewDefaultProduct";
import { Product, setState } from "@/types";
import NewProductFormCardView from "./view";
interface Props {
  onProductAdd: (newProduct: Product) => void;
  setShowNewProductForm: setState<boolean>;
}
const NewProductFormCard = ({ onProductAdd, setShowNewProductForm }: Props) => {
  const editProductInform = useEditProductInform(generateNewDefaultProduct());

  const onClickAddNewProduct = () => {
    onProductAdd(editProductInform.editingProduct);
    editProductInform.setEditingProduct(generateNewDefaultProduct());
    setShowNewProductForm(false);
  };

  const props = {
    ...editProductInform,
    onClickAddNewProduct,
  };

  return <NewProductFormCardView {...props} />;
};

export default NewProductFormCard;

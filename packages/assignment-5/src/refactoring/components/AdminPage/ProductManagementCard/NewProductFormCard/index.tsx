import { InputEventHandler, Product, setState } from "@/types";
import { useState } from "react";
import NewProductFormCardView from "./view";

interface Props {
  onProductAdd: (newProduct: Product) => void;
  setShowNewProductForm: setState<boolean>;
}
const NewProductFormCard = ({ onProductAdd, setShowNewProductForm }: Props) => {
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    stock: 0,
    discounts: [],
  });

  const onChangeName: InputEventHandler = (event) =>
    setNewProduct({ ...newProduct, name: event.target.value });

  const onChangeStock: InputEventHandler = (event) =>
    setNewProduct({
      ...newProduct,
      stock: parseInt(event.target.value),
    });

  const onChangePrice: InputEventHandler = (event) =>
    setNewProduct({
      ...newProduct,
      price: parseInt(event.target.value),
    });

  const onClickAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct({
      name: "",
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
  };

  const props = {
    newProduct,
    onChangeName,
    onChangeStock,
    onChangePrice,
    onClickAddNewProduct,
  };

  return <NewProductFormCardView {...props} />;
};

export default NewProductFormCard;

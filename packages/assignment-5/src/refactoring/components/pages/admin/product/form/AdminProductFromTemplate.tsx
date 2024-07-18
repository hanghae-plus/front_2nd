import { FC, ReactElement } from "react";
import Label from "../../common/Label";

interface Props {
  ProductName: ReactElement;
  ProductPrice: ReactElement;
  ProductStock: ReactElement;
  AddButton: ReactElement;
}

const AdminProductFromTemplate: FC<Props> = ({
  ProductName,
  ProductPrice,
  ProductStock,
  AddButton,
}) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
      <div className="mb-2">
        <Label htmlFor="productName">상품명</Label>
        {ProductName}
      </div>
      <div className="mb-2">
        <Label htmlFor="productPrice">가격</Label>
        {ProductPrice}
      </div>
      <div className="mb-2">
        <Label htmlFor="productStock">재고</Label>
        {ProductStock}
      </div>
      {AddButton}
    </div>
  );
};

export default AdminProductFromTemplate;

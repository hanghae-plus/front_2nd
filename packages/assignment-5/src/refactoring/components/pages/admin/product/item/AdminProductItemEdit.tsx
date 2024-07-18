import { FC, ReactElement } from "react";

interface Props {
  ProductName: ReactElement;
  ProductPrice: ReactElement;
  ProductStock: ReactElement;
  Discounts: ReactElement[];
  DiscountQuantity: ReactElement;
  DiscountRate: ReactElement;
  AddDiscountButton: ReactElement;
  EditButton: ReactElement;
}

const AdminProductItemTemplate: FC<Props> = ({
  ProductName,
  ProductPrice,
  ProductStock,
  Discounts,
  DiscountQuantity,
  DiscountRate,
  AddDiscountButton,
  EditButton,
}) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        {ProductName}
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        {ProductPrice}
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        {ProductStock}
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
        {Discounts}
        <div className="flex space-x-2">
          {DiscountQuantity}
          {DiscountRate}
          {AddDiscountButton}
        </div>
      </div>
      {EditButton}
    </div>
  );
};

export default AdminProductItemTemplate;

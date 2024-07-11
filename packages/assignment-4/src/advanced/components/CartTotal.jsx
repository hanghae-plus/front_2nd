import { useContext, useMemo } from 'react';
import {
  BULK_DISCOUNT_RATE,
  DEFAULT_DISCOUNT_RATE,
  DISCOUNT_QUANTITY,
} from '../constants';
import { ItemListContext } from '../contexts';
import { calculateTotal, formatRate, isBulk, isNeedDiscount } from '../utils';

export default function CartTotal() {
  const itemList = useContext(ItemListContext);

  const cartTotal = useMemo(() => {
    return itemList.reduce((pre, cur) => pre + cur.price * cur.quantity, 0);
  }, [itemList]);

  const discountRate = useMemo(() => {
    if (isBulk(itemList)) {
      return BULK_DISCOUNT_RATE;
    }
    if (isNeedDiscount(itemList)) {
      const discountedTotal = itemList.reduce((pre, cur) => {
        if (cur.quantity >= DISCOUNT_QUANTITY) {
          return pre + cur.quantity * cur.price * (1 - cur.discountRate);
        }
        return pre + cur.quantity * cur.price;
      }, 0);

      return (cartTotal - discountedTotal) / cartTotal;
    }
    return DEFAULT_DISCOUNT_RATE;
  }, [itemList]);

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      {`총액: ${calculateTotal(discountRate, cartTotal)}원`}
      {discountRate > DEFAULT_DISCOUNT_RATE && (
        <span className="text-green-500 ml-2">{`(${formatRate(discountRate)}% 할인 적용)`}</span>
      )}
    </div>
  );
}

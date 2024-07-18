import { CartContext } from '../contexts/index.ts';
import { useCart } from '../hooks';
import { ApplyCoupon } from './UI/cartPage/ApplyCoupon.tsx';
import { CartList } from './UI/cartPage/CartList.tsx';
import { Grid } from './UI/cartPage/Grid.tsx';
import { ProductList } from './UI/cartPage/ProductList/index.tsx';
import { Summary } from './UI/cartPage/Summary.tsx';
import { Title } from './UI/common/Title.tsx';

export const CartPage = () => {
  return (
    <div className="container mx-auto p-4">
      <Title>장바구니</Title>
      <Grid>
        <CartContext.Provider value={useCart()}>
          <ProductList />
          <div>
            <CartList />
            <ApplyCoupon />
            <Summary />
          </div>
        </CartContext.Provider>
      </Grid>
    </div>
  );
};

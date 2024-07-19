import { Product } from '@types';
import { useLocalStorage } from '../hooks';

export function useProducts() {
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const updateProduct = (id: string, updatedProduct: Product) => {
    console.log('id', id);
    console.log('updatedProduct', updatedProduct);
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === id ? updatedProduct : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
  };

  const getProduct = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  return { products, addProduct, updateProduct, deleteProduct, getProduct };
}

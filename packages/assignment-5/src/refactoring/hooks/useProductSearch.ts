import { useState, useEffect } from 'react';

export default function useProductSearch(products, query) {
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (!query) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(product => 
          product.name.toLowerCase().startsWith(query.toLowerCase())
        )
      );
    }
  }, [products, query]);

  return filteredProducts;
}

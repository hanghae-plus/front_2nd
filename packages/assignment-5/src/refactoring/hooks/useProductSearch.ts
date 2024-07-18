import { useState } from 'react';

export const useProductSearch = (originData) => {
  const [searchValue, setSearchValue] = useState('');
  let filteredData = [...originData];

  function checkData(value) {
    return originData.filter((item) => item.name.includes(value));
  }

  if (searchValue) {
    filteredData = checkData(searchValue);
  }

  return {
    searchValue,
    setSearchValue,
    filteredData,
  };
};

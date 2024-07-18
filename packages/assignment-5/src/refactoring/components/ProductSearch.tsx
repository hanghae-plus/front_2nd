import { useEffect, useState } from 'react';

export default function SearchProduct({ setSearchValue }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearchValue(value);
    }, 300);

    return () => {
      clearTimeout(debounce);
    };
  }, [value]);

  function handleChange(event) {
    const value = event.target.value;

    setValue(value);
  }

  return (
    <>
      <h2 className='text-2xl font-semibold mb-4'>상품 검색</h2>
      <input
        className='block w-full bg-white p-1 rounded shadow mb-4'
        type='text'
        placeholder='상품명을 검색해주세요.'
        value={value}
        onChange={handleChange}
      />
    </>
  );
}

import React from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function SearchBar({
  searchTerm,
  onSearchChange,
  placeholder = '검색어를 입력하세요',
}: SearchBarProps) {
  return (
    <FormControl>
      <FormLabel>일정 검색</FormLabel>
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={onSearchChange}
      />
    </FormControl>
  );
}

export default SearchBar;

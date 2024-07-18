import { useCallback, useState } from 'react';

export function useToggle(defaultValue: boolean = false): [boolean, () => void] {
  const [value, setValue] = useState(defaultValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle];
}

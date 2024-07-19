import { useCallback, useState } from 'react';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleIsAdmin = useCallback(() => {
    setIsAdmin((prev) => !prev);
  }, []);

  return { isAdmin, toggleIsAdmin };
};

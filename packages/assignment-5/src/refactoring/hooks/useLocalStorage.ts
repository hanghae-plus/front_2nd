import { useEffect } from 'react';

export const useLocalStorage = (id, state) => {
  useEffect(() => {
    localStorage.setItem(id, JSON.stringify(state));
  }, [id, state]);
};

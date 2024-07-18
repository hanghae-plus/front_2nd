import { useEffect } from 'react';

export const useLocalStorage = (id, state, setState) => {
  const localData = JSON.parse(localStorage.getItem(id));

  useEffect(() => {
    if (localData) {
      setState(localData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(id, JSON.stringify(state));
  }, [id, state]);
};

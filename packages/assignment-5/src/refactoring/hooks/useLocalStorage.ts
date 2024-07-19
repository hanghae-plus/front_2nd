import { useEffect } from 'react';

export const useLocalStorage = (id, state, setState) => {
  const getLocalStorage = () => {
    return JSON.parse(localStorage.getItem(id) || 'false');
  };
  const localData = getLocalStorage();

  useEffect(() => {
    if (localData) {
      setState(localData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(id, JSON.stringify(state));
  }, [id, state]);

  return {
    getLocalStorage,
  };
};

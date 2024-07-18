import { useState } from 'react';

export const useForm = <T>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);

  const updateValue = (name: keyof T, value: any) => {
    setValues({ ...values, [name]: value });
  };

  const reset = () => {
    setValues(initialValues);
  };

  return { values, updateValue, reset };
};

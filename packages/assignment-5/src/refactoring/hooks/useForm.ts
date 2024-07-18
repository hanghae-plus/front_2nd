import { useState } from 'react';

export const useForm = <T>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (name: keyof T, value: any) => {
    setValues({ ...values, [name]: value });
  };

  const reset = () => {
    setValues(initialValues);
  };

  return { values, handleChange, reset };
};

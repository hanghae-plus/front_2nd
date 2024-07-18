import { ChangeEvent, useState } from 'react';

type Event = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

export const useForm = <T>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (event: Event, transform?: (value: string) => number | string) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: transform ? transform(value) : value });
  };

  const reset = () => {
    setValues(initialValues);
  };

  return { values, handleChange, reset };
};

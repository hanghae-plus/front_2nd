import { useState } from 'react';

export default function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      callback();
    }
  };

  const validate = (validationRules) => {
    const newErrors = validationRules(values);
    setErrors(newErrors);
  };

  return {
    values,
    setValues,
    handleChange,
    handleSubmit,
    errors,
    validate
  };
}


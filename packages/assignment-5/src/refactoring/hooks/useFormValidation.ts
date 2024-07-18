import { useEffect, useState } from "react";

export const VALIDATION_CONDITIONS = {
  isNotEmpty: (value: string) => {
    return !!value;
  },
  isPositiveNumber: (value: string) => {
    return !!value && parseInt(value) > 0;
  },
  isRate: (value: string) => {
    return !!value && parseInt(value) >= 0 && parseInt(value) <= 100;
  },
};

const useFormValidation = (
  condition: (value: string) => boolean,
  value: string
) => {
  const [isValid, setIsValid] = useState<boolean>(false);

  const validation = () => {
    setIsValid(condition(value));
  };

  useEffect(validation, [condition, value]);
  return [isValid];
};

export default useFormValidation;

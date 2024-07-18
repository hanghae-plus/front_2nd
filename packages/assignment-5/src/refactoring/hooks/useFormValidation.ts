import { useEffect, useState } from "react";

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

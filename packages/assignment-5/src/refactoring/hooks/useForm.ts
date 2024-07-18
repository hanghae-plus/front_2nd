import { useCallback, useState } from "react";

export type FormElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

interface UseForm<T> {
  formState: T;
  resetForm: () => void;
  submitForm: (event: React.FormEvent) => void;
  register: (name: keyof T) => {
    name: keyof T;
    onChange: (event: React.ChangeEvent<FormElement>) => void;
  };
}

export const useForm = <T>(initialValue: T): UseForm<T> => {
  const [formState, setFormState] = useState<T>(initialValue);

  const handleChangeElement = useCallback((name: keyof T, value: unknown) => {
    console.log(value, 20);
    setFormState((prevState) => ({
      ...prevState,
      [name]: !isNaN(Number(value)) ? Number(value) : value,
    }));
  }, []);

  const register = useCallback(
    (name: keyof T) => ({
      name,
      onChange: (event: React.ChangeEvent<FormElement>) =>
        handleChangeElement(name, event.target.value),
    }),
    [handleChangeElement]
  );

  const resetForm = useCallback(() => {
    setFormState(initialValue);
  }, [initialValue]);

  const submitForm = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      resetForm();
    },
    [resetForm]
  );

  return {
    formState,
    resetForm,
    submitForm,
    register,
  };
};

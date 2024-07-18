import { useCallback, useState } from "react";

type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
interface UseForm<T> {
  formState: T;
  resetForm: () => void;
  submitForm: (event: React.FormEvent) => void;
  handleChangeElement: ({ target }: React.ChangeEvent<FormElement>) => void;
}

export const useForm = <T>(initialValue: T): UseForm<T> => {
  const [formState, setFormState] = useState(initialValue);

  /**
   * form을 초기 상태로 reset
   */
  const resetForm = useCallback(() => {
    setFormState(initialValue);
  }, [initialValue]);

  /**
   *
   */
  const handleChangeElement = useCallback(
    ({ target }: React.ChangeEvent<FormElement>) => {
      const { name, value } = target;

      setFormState((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    },
    []
  );

  const submitForm = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      console.log("submit!");
      resetForm();
    },
    [resetForm]
  );

  return { formState, resetForm, submitForm, handleChangeElement };
};

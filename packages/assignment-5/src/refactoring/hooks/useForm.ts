import { useCallback, useState } from "react";

interface useForm {}

export const useForm = <T>(initialValue: T) => {
  const [formState, setFormState] = useState(initialValue);

  /**
   * form을 초기 상태로 reset
   */
  const resetForm = useCallback(() => {
    setFormState(initialValue);
  }, [initialValue]);

  const handleInput = useCallback(
    ({ target }: { target: HTMLInputElement }) => {
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

  return { formState, resetForm, submitForm, handleInput };
};

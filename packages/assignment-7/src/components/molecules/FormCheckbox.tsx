import { FormControl, FormLabel, Checkbox } from "@chakra-ui/react";
import { ChangeEvent } from "react";

interface FormCheckboxProps {
  label: string;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  checkboxLabel?: string;
}

export const FormCheckbox = ({
  label,
  isChecked,
  onChange,
  checkboxLabel,
}: FormCheckboxProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Checkbox isChecked={isChecked} onChange={handleChange}>
        {checkboxLabel}
      </Checkbox>
    </FormControl>
  );
};

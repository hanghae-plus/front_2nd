import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { ChangeEvent } from "react";

type OptionValue = string | number;

interface Option<T extends OptionValue> {
  value: T;
  label: string;
}

interface FormSelectProps<T extends OptionValue> {
  value: T;
  onChange: (value: T) => void;
  label?: string;
  placeholder?: string;
  options?: Option<T>[];
}

export function FormSelect<T extends OptionValue>({
  label,
  value,
  onChange,
  placeholder,
  options,
}: FormSelectProps<T>) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = options?.find(
      (option) => option.value.toString() === e.target.value
    )?.value;
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Select value={value.toString()} onChange={handleChange}>
        {placeholder && <option value="">{placeholder}</option>}
        {options?.map((option) => (
          <option key={option.value.toString()} value={option.value.toString()}>
            {option.label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

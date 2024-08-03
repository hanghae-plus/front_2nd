import { FormControl, FormLabel, Input, Tooltip } from "@chakra-ui/react";
import { ChangeEvent } from "react";

type InputType = "text" | "date" | "time" | "number";

type InputTypeToValueType<T extends InputType> = T extends "number"
  ? number
  : string;

interface FormFieldProps<T extends InputType> {
  label: string;
  type: T;
  value: InputTypeToValueType<T>;
  onChange: (value: InputTypeToValueType<T>) => void;
  error?: string;
  isInvalid?: boolean;
  onBlur?: () => void;
  placeholder?: string;
}

export function FormField<T extends InputType>({
  label,
  type,
  value,
  onChange,
  error,
  isInvalid,
  onBlur,
  placeholder,
}: FormFieldProps<T>) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (type) {
      case "number":
        onChange(Number(e.target.value) as InputTypeToValueType<T>);
        break;
      case "date":
      case "time":
      case "text":
      default:
        onChange(e.target.value as InputTypeToValueType<T>);
        break;
    }
  };

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Tooltip label={error} isOpen={!!error} placement="top">
        <Input
          type={type}
          value={value}
          onChange={handleChange}
          isInvalid={isInvalid}
          onBlur={onBlur}
          placeholder={placeholder}
        />
      </Tooltip>
    </FormControl>
  );
}

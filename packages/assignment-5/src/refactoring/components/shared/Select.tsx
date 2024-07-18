import { ChangeEvent, SelectHTMLAttributes } from 'react';
import { cn } from '../../utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange: (value: string) => void;
  options: {
    label: string;
    value: string;
    disabled?: boolean;
  }[];
}

export const Select = ({
  options,
  className,
  onChange,
  onValueChange,
  disabled: disabledFromProps,
  ...props
}: SelectProps) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onValueChange(e.target.value);
    onChange?.(e);
  };

  return (
    <select {...props} onChange={handleChange} className={cn('w-full p-2 border rounded', className)}>
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled || disabledFromProps}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

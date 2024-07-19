import { HTMLAttributes } from "react";

interface AddProductButtonProps extends HTMLAttributes<HTMLButtonElement> {
  buttonText: string;
  disabled: boolean;
}

const AddProductButton = ({
  buttonText,
  disabled,
  ...props
}: AddProductButtonProps) => {
  return (
    <button
      className={`w-full px-3 py-1 rounded ${
        disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
      disabled={disabled}
      {...props}
    >
      {buttonText}
    </button>
  );
};

export default AddProductButton;

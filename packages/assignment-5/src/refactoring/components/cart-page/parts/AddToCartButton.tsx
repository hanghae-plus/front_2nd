import { ComponentProps } from "react";

const DEFAULT_CLASS_NAME = 'w-full px-3 py-1 rounded';
const DISABLED_CLASS_NAME = 'bg-gray-300 text-gray-500 cursor-not-allowed';
const ENABLED_CLASS_NAME = 'bg-blue-500 text-white hover:bg-blue-600';

export const AddToCartButton = ({ className: originClassName, ...props }: ComponentProps<'button'>) => {
  const className = `${originClassName} ${DEFAULT_CLASS_NAME} ${props.disabled ? DISABLED_CLASS_NAME : ENABLED_CLASS_NAME}`;

  return (
    <button
      {...props}
      className={className}
    >
      {props.disabled ? '품절' : '장바구니에 추가'}
    </button>
  );
}

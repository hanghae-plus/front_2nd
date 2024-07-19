import { PropsWithChildren } from 'react';

interface ButtonType {
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  bgColor?: 'bg-blue-500' | 'bg-red-500';
  textColor?: 'text-white' | 'text-black';
  icon?: React.ReactNode;
  extraClassName?: string;
  onClick?: () => void;
}
const Button = ({ children, extraClassName, type = 'button' }: PropsWithChildren<ButtonType>) => {
  return (
    <button type={type} className={cn('bg-blue-500', extraClassName)}>
      {children}
    </button>
  );
};

export default Button;

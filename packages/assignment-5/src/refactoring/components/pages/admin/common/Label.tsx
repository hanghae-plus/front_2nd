import { FC, PropsWithChildren } from "react";

interface Props {
  htmlFor: string;
}

const Label: FC<PropsWithChildren<Props>> = ({ children, htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700"
    >
      {children}
    </label>
  );
};

export default Label;

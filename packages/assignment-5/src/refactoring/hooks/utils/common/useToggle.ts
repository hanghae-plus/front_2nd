import { useState } from "react";

const useToggle = () => {
  const [isShow, setIsShow] = useState(false);

  const toggle = () => setIsShow((prev) => !prev);
  const show = () => setIsShow(true);
  const close = () => setIsShow(false);

  return { isShow, toggle, show, close };
};

export default useToggle;

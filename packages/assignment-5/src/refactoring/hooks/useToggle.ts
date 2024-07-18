import { useState } from "react";

const useToggle = (initValue: boolean) => {
  const [state, setState] = useState<boolean>(initValue);

  const toggleState = () => setState((prev) => !prev);

  return [state, toggleState] as [boolean, () => void];
};

export default useToggle;

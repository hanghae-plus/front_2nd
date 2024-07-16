import { setState } from "@/types";
import { useCallback } from "react";
import NavigationBarView from "./view";

interface NavigationBarProps {
  isAdmin: boolean;
  setIsAdmin: setState<boolean>;
}
const NavigationBar = ({ isAdmin, setIsAdmin }: NavigationBarProps) => {
  const onClickSwitchPage = useCallback(() => {
    setIsAdmin((prev) => !prev);
  }, [setIsAdmin]);

  const props = {
    isAdmin,
    onClickSwitchPage,
  };
  return <NavigationBarView {...props} />;
};

export default NavigationBar;

import NavigationBarView from "./view";

interface NavigationBarProps {
  isAdmin: boolean;
  toggleIsAdmin: () => void;
}
const NavigationBar = ({ isAdmin, toggleIsAdmin }: NavigationBarProps) => {
  const props = {
    isAdmin,
    toggleIsAdmin,
  };
  return <NavigationBarView {...props} />;
};

export default NavigationBar;

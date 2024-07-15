import HeaderView from "./view";

interface HeaderProps {
  isAdmin: boolean;
  onClickSwitchPage: () => void;
}
const Header = ({ isAdmin, onClickSwitchPage }: HeaderProps) => {
  const props = {
    isAdmin,
    onClickSwitchPage,
  };
  return <HeaderView {...props} />;
};

export default Header;

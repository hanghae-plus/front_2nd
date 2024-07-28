interface Props {
  title: string;
}

const Header = ({ title }: Props) => {
  return <h1 className="text-3xl font-bold mb-6">{title}</h1>;
};

export default Header;

const TITLE = '쇼핑몰 관리 시스템';
const TO_CART_PAGE = '장바구니 페이지로';
const TO_ADMIN_PAGE = '관리자 페이지로';

interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  isAdmin: boolean;
}

export const Header = (props: Props) => {
  const { onClick, isAdmin } = props;

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">{TITLE}</h1>
        <button
          onClick={onClick}
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
        >
          {isAdmin ? TO_CART_PAGE : TO_ADMIN_PAGE}
        </button>
      </div>
    </nav>
  );
};

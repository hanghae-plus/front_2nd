import { createContext, useState } from 'react';
import CartHeader from '../components/CartHeader';

export const DisplayContext = createContext<boolean>(false);
export const DisplaySettingContext = createContext<() => void>(() => {});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const handleDisplay = () => {
    setIsAdmin((prev) => !prev);
  };
  return (
    <DisplayContext.Provider value={isAdmin}>
      <DisplaySettingContext.Provider value={handleDisplay}>
        <div className="min-h-screen bg-gray-100">
          <CartHeader />
          {children}
        </div>
      </DisplaySettingContext.Provider>
    </DisplayContext.Provider>
  );
};

export default Layout;

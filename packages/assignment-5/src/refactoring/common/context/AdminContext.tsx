import { createContext, PropsWithChildren, useState } from 'react';

export interface AdminContextType {
  isAdmin: boolean;
  toggleAdmin: () => void;
}

export const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  toggleAdmin: () => {}
});

const AdminProvider = ({ children }: PropsWithChildren) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdmin = () => {
    setIsAdmin((isAdmin) => !isAdmin);
  };

  return <AdminContext.Provider value={{ isAdmin, toggleAdmin: toggleAdmin }}>{children}</AdminContext.Provider>;
};

export default AdminProvider;

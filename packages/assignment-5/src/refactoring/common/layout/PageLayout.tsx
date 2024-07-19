import { PropsWithChildren } from 'react';

const PageLayout = ({ children }: PropsWithChildren) => {
  return <div className="min-h-screen bg-gray-100">{children}</div>;
};

export default PageLayout;

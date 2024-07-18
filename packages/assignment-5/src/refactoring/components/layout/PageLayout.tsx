import React from 'react';

interface PageLayout {
  title: string;
  children: React.ReactNode;
}

export const PageLayout = ({ title, children }: PageLayout) => {
  return (
    <div className="containter mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
};

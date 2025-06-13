import React from "react";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-100 main-layout">
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;

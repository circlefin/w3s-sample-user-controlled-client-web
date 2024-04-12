import React from "react";

export const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-5 pb-4 h-full flex flex-col gap-y-4 overflow-auto">
      {children}
    </div>
  );
};

import React from "react";

export default function AppCard({ children }: any) {
  return (
    <>
      <div className="w-full p-4 border border-gray-300 rounded-md">
        {children}
      </div>
    </>
  );
}

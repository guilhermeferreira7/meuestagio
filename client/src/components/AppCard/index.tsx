import React from "react";

export default function AppCard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full p-4 border border-gray-300 rounded-md shadow-md shadow-blue-300">
        {children}
      </div>
    </>
  );
}

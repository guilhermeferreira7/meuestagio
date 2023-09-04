import React from "react";

interface AppTableProps {
  children: React.ReactNode[];
  headers: string[];
}

export default function Table({ children, headers }: AppTableProps) {
  return (
    <>
      <div className="overflow-x-auto w-full">
        <table className="table w-full min-h-16">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </>
  );
}

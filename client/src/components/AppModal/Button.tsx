import React from "react";

interface ButtonProps {
  id: string;
  children?: React.ReactNode;
}

export default function Button({ children, id }: ButtonProps) {
  return (
    <label htmlFor={id} className="btn btn-info">
      {children}
    </label>
  );
}

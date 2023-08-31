import React from "react";

interface ButtonProps {
  id: string;
  children?: React.ReactNode;
  type?: "info" | "success" | "warning" | "error" | "primary";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  id,
  type = "info",
  size = "md",
}: ButtonProps) {
  return (
    <label htmlFor={id} className={`btn btn-${type} btn-${size}`}>
      {children}
    </label>
  );
}

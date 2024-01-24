import React, { LabelHTMLAttributes } from "react";

interface ButtonProps extends LabelHTMLAttributes<HTMLLabelElement> {
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
  ...rest
}: ButtonProps) {
  return (
    <label {...rest} htmlFor={id} className={`btn btn-${type} btn-${size}`}>
      {children}
    </label>
  );
}

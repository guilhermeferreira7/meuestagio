import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  title: string;
}

export function InputCheckbox(props: InputProps) {
  const { register } = useFormContext();

  return (
    <input
      type="checkbox"
      data-title={props.title}
      className="checkbox checkbox-primary"
      id={props.name}
      {...register(props.name)}
      {...props}
    />
  );
}

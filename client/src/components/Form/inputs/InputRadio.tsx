import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  title: string;
}

export function InputRadio(props: InputProps) {
  const { register } = useFormContext();

  return (
    <input
      type="radio"
      data-title={props.title}
      className="bg-white text-base-content btn btn-primary"
      id={props.name}
      {...register(props.name)}
      {...props}
    />
  );
}

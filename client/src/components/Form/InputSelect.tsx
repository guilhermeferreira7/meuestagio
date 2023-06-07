import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLSelectElement> {
  name: string;
}

export function InputSelect(props: InputProps): JSX.Element {
  const { register } = useFormContext();

  return (
    <select
      id={props.name}
      {...register(props.name)}
      className="rounded select select-primary"
      defaultValue=""
      {...props}
    >
      {props.children}
    </select>
  );
}

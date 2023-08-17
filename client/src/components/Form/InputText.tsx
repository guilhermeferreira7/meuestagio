import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

/**
 * this can be used with input type text, password, email, etc
 */
export function InputText(props: InputProps): JSX.Element {
  const { register } = useFormContext();

  return (
    <input
      id={props.name}
      type="text"
      className="bg-white rounded input input-primary disabled:placeholder:text-gray-500"
      {...register(props.name)}
      {...props}
    />
  );
}

import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

export function InputCheckbox(props: InputProps) {
  const { register } = useFormContext();

  return (
    <div className="flex gap-1 my-1">
      <label htmlFor={props.name}>
        <span className="font-semibold">{props.label}</span>
      </label>
      <input
        type="checkbox"
        className="checkbox checkbox-primary flex items-center"
        id={props.name}
        {...register(props.name)}
        {...props}
      />
    </div>
  );
}

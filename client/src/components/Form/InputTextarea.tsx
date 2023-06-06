import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

export function InputTextarea(props: TextareaProps): JSX.Element {
  const { register } = useFormContext();

  return (
    <textarea
      id={props.name}
      type="text"
      className="textarea textarea-primary"
      {...register(props.name)}
      {...props}
    />
  );
}

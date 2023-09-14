import { InputHTMLAttributes, useState } from "react";
import { useFormContext } from "react-hook-form";
import { monthYearMask } from "../../utils/masks/monthYearMask";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export function Date(props: InputProps): JSX.Element {
  const { register } = useFormContext();
  const [date, setDate] = useState("");

  const inputChange = (e: any) => {
    const { value } = e.target;
    setDate(value);
  };

  return (
    <input
      id={props.name}
      type="text"
      placeholder="mm/aaaa"
      className="bg-white rounded input input-primary disabled:placeholder:text-gray-500"
      {...register(props.name)}
      {...props}
      value={monthYearMask(date)}
      onChange={inputChange}
    />
  );
}

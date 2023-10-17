import { AddAPhoto } from "@mui/icons-material";

type ImageInputProps = {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  key?: string;
};

export default function ImageInput({ setFile, key }: ImageInputProps) {
  return (
    <div>
      <label
        htmlFor={`input-file${key}`}
        className="cursor-pointer underline text-info flex items-center gap-1"
      >
        <span>Adicionar foto</span>
        <AddAPhoto />
      </label>
      <input
        id={`input-file${key}`}
        name={`input-file${key}`}
        className="opacity-0 absolute -z-10"
        type="file"
        accept="image/*"
        onChange={(e) => {
          setFile(e.target.files![0]);
        }}
      />
    </div>
  );
}

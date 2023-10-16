import { AddAPhoto } from "@mui/icons-material";
import { Button, styled } from "@mui/material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

type ImageInputProps = {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function ImageInput({ setFile }: ImageInputProps) {
  return (
    <>
      <Button
        component="label"
        variant="contained"
        startIcon={<AddAPhoto />}
        className="text-center btn btn-info"
      >
        Mudar imagem
        <VisuallyHiddenInput
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files![0]);
          }}
        />
      </Button>
    </>
  );
}

import { Loop, PhotoOutlined } from "@mui/icons-material";
import Image from "next/image";
import { useState } from "react";

import { COMPANY_PROFILE_PICTURE_PATH } from "app-constants";
import { ImageInput, notify } from "components";
import { api } from "services";
import { Company } from "types";
import { errorToString } from "utils";

type ImageFormProps = {
  company: Company;
  setCompany: React.Dispatch<React.SetStateAction<Company>>;
};

export default function ImageForm({ company, setCompany }: ImageFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const upload = async () => {
    if (file && file.type.includes("image")) {
      try {
        setIsUploading(true);
        const companyUpdated = await api.post(
          COMPANY_PROFILE_PICTURE_PATH,
          {
            file,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setCompany(companyUpdated.data);
        setFile(null);
        notify.success("Foto atualizada com sucesso!");
      } catch (error) {
        notify.error(errorToString(error));
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-1 items-start">
        <h2>
          <p className="flex items-center gap-1 text-xl font-semibold">
            <PhotoOutlined /> Imagem de perfil
          </p>
          <p className="italic text-gray-500 text-sm">
            A foto de perfil deve ser quadrada.
          </p>
        </h2>
        <div className="flex flex-col items-center gap-1">
          {file ? (
            <Image
              className="w-32 h-32 rounded-sm border-4 border-primary"
              src={URL.createObjectURL(file)}
              alt="Imagem de perfil"
              width={100}
              height={100}
            />
          ) : (
            company.imageUrl && (
              <Image
                className="w-32 h-32 rounded-sm"
                src={company.imageUrl}
                alt="Imagem de perfil"
                width={100}
                height={100}
              />
            )
          )}
          <div className="flex flex-col items-center gap-2">
            <ImageInput setFile={setFile} />
            {file && (
              <>
                {isUploading ? (
                  <button className="btn btn-primary">
                    Atualizando <Loop className="animate-spin" />
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      className="text-error "
                      onClick={() => setFile(null)}
                    >
                      Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={upload}>
                      Salvar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

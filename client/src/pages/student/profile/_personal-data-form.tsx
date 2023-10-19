import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageOutlined, PersonOutline } from "@mui/icons-material";

import defaultImage from "../../../../public/avatar.png";

import { ImageInput } from "../../../components";
import { notify } from "../../../components/toasts/toast";
import {
  PROFILE_STUDENT_PATH,
  STUDENT_PROFILE_PICTURE_PATH,
} from "../../../constants/api-routes";
import { api } from "../../../services/api/api";
import { Student, StudentPatch } from "../../../types/users/student";
import { errorToString } from "../../../utils/helpers/error-to-string";

type PersonalDataFormProps = {
  student: Student;
};

export default function PersonalDataForm({ student }: PersonalDataFormProps) {
  const [studentUpdated, setStudentUpdated] = useState<Student>(student);
  const [file, setFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<{ name: string; about?: string }>({
    name: studentUpdated.name,
    about: studentUpdated.about,
  });

  useEffect(() => {
    if (file) setIsEditing(true);
    else if (
      formData.name !== studentUpdated.name ||
      formData.about !== studentUpdated.about
    )
      setIsEditing(true);
    else setIsEditing(false);
  }, [file, formData]);

  const upload = async () => {
    if (!file) return;
    setIsUpdating(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await api.post(STUDENT_PROFILE_PICTURE_PATH, data);
      setStudentUpdated(response.data);
      notify.success("Imagem de perfil atualizada com sucesso!");
      setFile(null);
    } catch (error) {
      notify.error(errorToString(error));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    if (file) {
      await upload();
    }

    if (
      formData.name !== studentUpdated.name ||
      formData.about !== studentUpdated.about
    ) {
      try {
        const response = await api.patch<StudentPatch>(PROFILE_STUDENT_PATH, {
          name: formData.name,
          about: formData.about,
        });
        setStudentUpdated(response.data.student);
        notify.success("Dados atualizados com sucesso!");
      } catch (error) {
        notify.error(errorToString(error));
      } finally {
        setIsEditing(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: studentUpdated.name,
      about: studentUpdated.about,
    });
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold flex gap-1 pb-2">
          <PersonOutline />
          <span>Dados Pessoais</span>
        </h2>
        <div className="flex items-center gap-1">
          {isEditing && (
            <>
              <button className="text-error" onClick={() => resetForm()}>
                Cancelar
              </button>
              {isUpdating ? (
                <span className="text-primary">Salvando...</span>
              ) : (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleSubmit}
                >
                  Salvar
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col items-center gap-1 pr-10">
          <span className="font-semibold">
            <ImageOutlined /> Foto de perfil
          </span>
          {file ? (
            <Image
              className="w-32 h-32 rounded-sm border-4 border-primary"
              src={URL.createObjectURL(file)}
              alt="Imagem de perfil"
              width={100}
              height={100}
            />
          ) : studentUpdated.imageUrl ? (
            <Image
              className="w-32 h-32 rounded-sm"
              src={studentUpdated.imageUrl}
              alt="Imagem de perfil"
              width={100}
              height={100}
            />
          ) : (
            <Image
              className="w-32 h-32 rounded-sm"
              src={defaultImage}
              alt="Imagem de perfil"
              width={100}
              height={100}
            />
          )}
          {file && (
            <button className="text-error" onClick={() => setFile(null)}>
              Cancelar
            </button>
          )}
          <ImageInput setFile={setFile} />
        </div>
        <form className="flex flex-col flex-1">
          <div>
            <label htmlFor="name" className="font-semibold">
              Nome
            </label>
            <input
              name="name"
              id="name"
              type="text"
              className="input input-primary w-full"
              placeholder="Nome"
              value={formData.name}
              onChange={(event) => {
                setFormData({ ...formData, name: event.target.value });
              }}
            />
          </div>
          <div>
            <label htmlFor="about" className="font-semibold">
              Sobre
            </label>
            <textarea
              name="about"
              id="about"
              className="textarea textarea-primary w-full"
              placeholder="Fale um pouco sobre você"
              value={formData.about}
              onChange={(event) => {
                setFormData({ ...formData, about: event.target.value });
              }}
            />
          </div>
        </form>
      </div>
    </>
  );
}

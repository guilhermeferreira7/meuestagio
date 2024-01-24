import { Remove } from "@mui/icons-material";
import { useState } from "react";

import { EDUCATION_PATH } from "app-constants";
import { notify } from "components";
import { api } from "services";
import { Education } from "types";

type EducationItemProps = {
  educations: Education[];
  setEducations: any;
  education: Education;
};

export default function EducationItem({
  educations,
  setEducations,
  education,
}: EducationItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteEducation = async (education: Education) => {
    try {
      await api.delete(EDUCATION_PATH(education.id));
      setEducations(educations.filter((s) => s.id !== education.id));
      notify.success("Formação excluída com sucesso");
    } catch (error: any) {
      notify.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      className="text-lg flex items-center justify-between border-b p-2 border-b-gray-300"
      key={education.id}
    >
      <span>
        {education.school} - {education.degree} - {education.fieldOfStudy}
      </span>
      {isDeleting ? (
        <button
          className="btn btn-error"
          onClick={() => deleteEducation(education)}
        >
          Clique para excluir
        </button>
      ) : (
        <button className="btn btn-error" onClick={() => setIsDeleting(true)}>
          <Remove />
        </button>
      )}
    </div>
  );
}

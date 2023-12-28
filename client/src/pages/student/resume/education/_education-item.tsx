import { useState } from "react";
import { Remove } from "@mui/icons-material";

import { notify } from "../../../../components/toasts/toast";
import { EDUCATION_PATH } from "../../../../constants/api-routes";
import { Education } from "../../../../types/resume";
import { api } from "../../../../services/api/api";

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

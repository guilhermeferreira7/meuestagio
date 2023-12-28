import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Education } from "../../../../types/resume";
import {
  FormAddEducation,
  createEducationSchema,
} from "../../../../utils/validators/edit-resume-schema";

export function useEducationForm(educations: Education[]) {
  const [educationsUpdated, setEducations] = useState<Education[]>(educations);
  const createEducationForm = useForm<FormAddEducation>({
    mode: "all",
    resolver: zodResolver(createEducationSchema),
  });
  const { handleSubmit } = createEducationForm;

  return {
    educationsUpdated,
    setEducations,
    createEducationForm,
    handleSubmit,
  };
}

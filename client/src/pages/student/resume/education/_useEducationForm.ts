import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { CreateEducationSchema } from "schemas";
import { Education } from "types";

export function useEducationForm(educations: Education[]) {
  const [educationsUpdated, setEducations] = useState<Education[]>(educations);
  const createEducationForm = useForm<CreateEducationSchema>({
    mode: "all",
    resolver: zodResolver(CreateEducationSchema),
  });
  const { handleSubmit } = createEducationForm;

  return {
    educationsUpdated,
    setEducations,
    createEducationForm,
    handleSubmit,
  };
}

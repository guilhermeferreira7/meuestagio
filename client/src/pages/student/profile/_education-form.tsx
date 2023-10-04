import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, School } from "lucide-react";
import { Autocomplete, TextField } from "@mui/material";

import { notify } from "../../../components/toasts/toast";
import { COURSES_PATH, INSTITUTIONS_PATH } from "../../../constants/api-routes";
import { api } from "../../../services/api/api";
import { Institution } from "../../../types/institution";
import { Course } from "../../../types/course";
import { errorToString } from "../../../utils/helpers/error-to-string";
import { editEducationSchema } from "../../../utils/validators/edit-profile-schema";
import { Form } from "../../../components";

type EducationData = z.infer<typeof editEducationSchema>;

export default function EducationForm({ initialData, courses }: any) {
  const [coursesList, setCoursesList] = useState<Course[]>(courses);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  useEffect(() => {
    api
      .get<Institution[]>(INSTITUTIONS_PATH)
      .then((response) => setInstitutions(response.data))
      .catch((error) => notify.error(errorToString(error)));
  }, []);

  const [formDisabled, setFormDisabled] = useState(true);
  const editEducationForm = useForm<EducationData>({
    resolver: zodResolver(editEducationSchema),
  });

  const { handleSubmit } = editEducationForm;

  const setCourses = async (institutionId: string) => {
    editEducationForm.setValue("course", "");
    editEducationForm.setValue("institution", institutionId);
    if (!institutionId) return setCoursesList([]);
    try {
      const courses = await api.get<Course[]>(COURSES_PATH, {
        params: {
          institutionId: institutionId,
        },
      });
      setCoursesList(courses.data);
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  const editProfile = async (data: EducationData) => {
    console.log(data);
  };

  return (
    <>
      <FormProvider {...editEducationForm}>
        <div className="lg:grid grid-cols-2 gap-2">
          <div className="flex justify-between col-span-2">
            <h2 className="text-md font-semibold flex gap-1">
              <School />
              <span>Instituição</span>
            </h2>
            <div className="flex items-center gap-1">
              {!formDisabled ? (
                <>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => {
                      editEducationForm.reset({
                        institution: initialData.institution.id,
                        course: initialData.course.id,
                      });
                      setFormDisabled(!formDisabled);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={handleSubmit(editProfile)}
                  >
                    Salvar
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-sm btn-primary gap-1"
                  onClick={() => {
                    setFormDisabled(!formDisabled);
                  }}
                >
                  <Pencil size={18} />
                  <span>Editar</span>
                </button>
              )}
            </div>
          </div>
          <Form.Field>
            <Autocomplete
              className="pt-1"
              id="institution"
              disabled={formDisabled}
              onChange={(_e, value) => {
                if (!value) setCourses("");
                else setCourses(value.split(" - ")[0]);
              }}
              options={institutions.map((institution) => {
                return `${institution.id} - ${institution.name}`;
              })}
              renderInput={(params) => (
                <TextField {...params} label="Instituição" />
              )}
            />
            <Form.ErrorMessage field="institution" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="course">Curso</Form.Label>
            {formDisabled ? (
              <Form.InputText
                name="course"
                disabled
                defaultValue={initialData.course.name}
              />
            ) : (
              <Form.InputSelect name="course">
                {coursesList.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </Form.InputSelect>
            )}
            <Form.ErrorMessage field="course" />
          </Form.Field>
        </div>
      </FormProvider>
    </>
  );
}

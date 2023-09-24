import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, School } from "lucide-react";

import { notify } from "../../../components/toasts/toast";
import { Form } from "../../../components/Form";
import { api } from "../../../services/api/api";
import { Institution } from "../../../types/institution";
import { Course } from "../../../types/course";
import { errorToString } from "../../../utils/helpers/error-to-string";
import { editEducationSchema } from "../../../utils/validators/edit-profile-schema";

type EducationData = z.infer<typeof editEducationSchema>;

export default function EducationForm({ initialData, courses }: any) {
  const [coursesList, setCoursesList] = useState<Course[]>(courses);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  useEffect(() => {
    api
      .get<Institution[]>("/institutions")
      .then((response) => setInstitutions(response.data))
      .catch((error) => notify.error(errorToString(error)));
  }, [institutions]);

  const [formDisabled, setFormDisabled] = useState(true);
  const editEducationForm = useForm<EducationData>({
    resolver: zodResolver(editEducationSchema),
  });

  const { handleSubmit } = editEducationForm;

  const setCourses = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    editEducationForm.setValue("course", "");
    try {
      const courses = await api.get<Course[]>("/courses", {
        params: {
          institutionId: e.target.value,
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
              <span>Educação</span>
            </h2>
            <div className="flex items-center gap-1">
              {!formDisabled ? (
                <>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => {
                      editEducationForm.reset({
                        institution: initialData.institution,
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
            <Form.Label htmlFor="institution">Instituição</Form.Label>
            <Form.InputSelect
              name="institution"
              disabled={formDisabled}
              defaultValue={initialData.institution}
              onChange={setCourses}
            >
              {institutions.map((institution: any) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
            </Form.InputSelect>
            <Form.ErrorMessage field="institution" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="course">Curso</Form.Label>
            <Form.InputSelect
              name="course"
              disabled={formDisabled}
              defaultValue={initialData.course.id}
            >
              <option value={initialData.course.id}>
                {initialData.course.name}
              </option>
              {coursesList.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </Form.InputSelect>
            <Form.ErrorMessage field="course" />
          </Form.Field>
        </div>
      </FormProvider>
    </>
  );
}

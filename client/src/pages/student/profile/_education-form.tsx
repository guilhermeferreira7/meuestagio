import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditOutlined, SchoolOutlined } from "@mui/icons-material";

import { notify } from "../../../components/toasts/toast";
import { Form } from "../../../components";
import {
  COURSES_PATH,
  PROFILE_STUDENT_PATH,
} from "../../../constants/api-routes";
import { api } from "../../../services/api/api";
import { Institution } from "../../../types/institution";
import { Course } from "../../../types/course";
import { Student } from "../../../types/users/student";
import { errorToString } from "../../../utils/helpers/error-to-string";
import {
  EducationData,
  editEducationSchema,
} from "../../../utils/validators/edit-profile-schema";

type EducationFormProps = {
  student: Student;
  courses: Course[];
  institutions: Institution[];
};

export default function EducationForm({
  courses,
  institutions,
  student,
}: EducationFormProps) {
  const [coursesUpdated, setCoursesUpdated] = useState<Course[]>(courses);

  const [formDisabled, setFormDisabled] = useState(true);
  const editEducationForm = useForm<EducationData>({
    resolver: zodResolver(editEducationSchema),
    defaultValues: {
      institutionId: student.institution.name,
      courseId: student.course.name,
    },
  });
  const { handleSubmit } = editEducationForm;

  const setCourses = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const institutionId = event.target.value;
    editEducationForm.setValue("courseId", "");
    editEducationForm.setValue("institutionId", institutionId);
    if (!institutionId) return setCoursesUpdated([]);

    try {
      const courses = await api.get<Course[]>(COURSES_PATH, {
        params: {
          institutionId: institutionId,
        },
      });
      setCoursesUpdated(courses.data);
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  const resetForm = (institution?: string, course?: string) => {
    editEducationForm.reset({
      institutionId: institution ? institution : student.institution.name,
      courseId: course ? course : student.course.name,
    });
    setFormDisabled(true);
  };

  const editProfile = async (data: EducationData) => {
    try {
      const student = await api.patch(PROFILE_STUDENT_PATH, data);
      resetForm(
        student.data.student.institution.name,
        student.data.student.course.name
      );
      notify.success("Instituição e curso atualizados com sucesso!");
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  return (
    <>
      <FormProvider {...editEducationForm}>
        <div className="lg:grid grid-cols-2 gap-2">
          <div className="flex justify-between col-span-2">
            <h2 className="text-md font-semibold flex gap-1">
              <SchoolOutlined />
              <span>Instituição</span>
            </h2>
            <div className="flex items-center gap-1">
              {!formDisabled ? (
                <>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => resetForm()}
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
                  onClick={() => {
                    setFormDisabled(!formDisabled);
                  }}
                  className="flex items-center text-info"
                >
                  <EditOutlined /> Editar
                </button>
              )}
            </div>
          </div>
          <Form.Field>
            <Form.Label htmlFor="institutionId">Instituição</Form.Label>
            {formDisabled ? (
              <Form.InputText name="institutionId" disabled />
            ) : (
              <Form.InputSelect name="institutionId" onChange={setCourses}>
                {institutions.map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                ))}
              </Form.InputSelect>
            )}
            <Form.ErrorMessage field="institutionId" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="courseId">Curso</Form.Label>
            {formDisabled ? (
              <Form.InputText name="courseId" disabled />
            ) : (
              <Form.InputSelect name="courseId">
                {coursesUpdated.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </Form.InputSelect>
            )}
            <Form.ErrorMessage field="courseId" />
          </Form.Field>
        </div>
      </FormProvider>
    </>
  );
}

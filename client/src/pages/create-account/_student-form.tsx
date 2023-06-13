import React, { useState } from "react";
import { Form } from "../../components/Form";
import { Institution } from "../../utils/types/institution";
import { Course } from "../../utils/types/course";
import { api } from "../../services/api/api";
import { UseFormReturn } from "react-hook-form";

interface CreateStudentFormProps {
  institutions: Institution[];
  form: UseFormReturn<
    {
      userRole: "student" | "company";
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
      institutionId?: string | undefined;
      courseId?: string | undefined;
      cnpj?: string | undefined;
      cityId?: string | undefined;
    },
    any
  >;
}

export default function CreateStudentForm({
  institutions,
  form,
}: CreateStudentFormProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseSelected, setCourseSelected] = useState<string>("");

  const changeCourseSelected = (event: any) => {
    const id = event.target.value;
    setCourseSelected(id);
  };

  const changeCourses = async (event: any) => {
    form.setValue("courseId", "");
    const id = event.target.value;
    try {
      const institution = institutions.find(
        (institution) => institution.id === +id
      );
      if (institution) form.setValue("cityId", institution.cityId + "");

      const response = await api.get<Course[]>(`/institutions/${id}/courses`);
      setCourseSelected("");
      setCourses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Quem é você?</h2>
      <Form.Field>
        <Form.Label htmlFor="name">Digite seu nome completo</Form.Label>
        <Form.InputText name="name" />
        <Form.ErrorMessage field="name" />
      </Form.Field>

      <h2 className="mt-2">Qual é seu curso?</h2>
      <Form.Field>
        <Form.Label htmlFor="institutionId">Instituição</Form.Label>
        <Form.InputSelect name="institutionId" onChange={changeCourses}>
          <option disabled value="">
            Escolha uma instituição
          </option>
          {institutions.map((institution) => {
            return (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            );
          })}
        </Form.InputSelect>
        <Form.ErrorMessage field="institutionId" />
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="courseId">Curso</Form.Label>
        <Form.InputSelect
          name="courseId"
          value={courseSelected}
          onChange={changeCourseSelected}
        >
          <option disabled value="">
            Qual seu curso?
          </option>
          {courses.map((course: any) => {
            return (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            );
          })}
        </Form.InputSelect>
        <Form.ErrorMessage field="courseId" />
      </Form.Field>
    </div>
  );
}

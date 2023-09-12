import React from "react";
import { Pencil, User } from "lucide-react";
import { ToastContainer } from "react-toastify";

import AppCard from "../../../components/AppCard";
import { notify } from "../../../components/toasts/toast";
import ContactInfoForm from "./_contact-form";
import EducationForm from "./_education-form";
import AddressForm from "./_address-form";
import withStudentAuth from "../../../services/auth/withStudentAuth";
import { api } from "../../../services/api/api";
import { Student } from "../../../types/users/student";
import { City } from "../../../types/city";
import { Institution } from "../../../types/institution";
import { Course } from "../../../types/course";
import { errorToString } from "../../../utils/helpers/error-to-string";

interface StudentProfileProps {
  student: Student;
  cities: City[];
  institutions: Institution[];
  courses: Course[];
}

export default function StudentProfile({
  student,
  cities,
  institutions,
  courses,
}: StudentProfileProps) {
  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const about = event.currentTarget.about.value;

    try {
      await api.patch("/students/profile", {
        about,
      });
      notify.success("Dados atualizados com sucesso");
    } catch (error) {
      notify.error(errorToString(error));
    }
  };
  return (
    <>
      <div className="flex flex-col gap-2 w-11/12 mb-4">
        <AppCard>
          <h1 className="font-semibold text-2xl flex items-center gap-1">
            <User />
            Dados pessoais
          </h1>
          <div className="divider"></div>
          <div>
            <span className="font-semibold flex gap-1 items-center mb-1">
              <Pencil />
              Sobre mim
            </span>
            <form className="flex gap-1" onSubmit={handleUpdate}>
              <textarea
                name="about"
                id="about"
                placeholder="Escreva algo sobre você"
                className="textarea textarea-primary w-full"
              >
                {student?.about}
              </textarea>
              <button className="btn btn-primary self-end">Salvar</button>
            </form>
          </div>

          <div className="divider"></div>
          <ContactInfoForm
            initialData={{
              ...student,
            }}
          />

          <div className="divider"></div>
          <EducationForm
            initialData={{
              institution: student.institution.id,
              course: {
                id: student.course.id,
                name: student.course.name,
              },
            }}
            courses={courses}
            institutions={institutions}
          />

          <div className="divider"></div>
          <AddressForm
            initialData={{
              city: student.city.name,
              state: student.city.state,
            }}
            cities={cities}
          />
        </AppCard>
      </div>

      <ToastContainer />
    </>
  );
}

export const getServerSideProps = withStudentAuth(
  async (_context, student, apiClient) => {
    const cities = await apiClient.get<City[]>("/cities");
    const institutions = await apiClient.get<Institution[]>("/institutions", {
      params: {
        cityId: student.city.id,
      },
    });
    const courses = await apiClient.get<Course[]>(
      `/institutions/${student.institution.id}/courses`
    );

    return {
      props: {
        student: student,
        cities: cities.data,
        institutions: institutions.data,
        courses: courses.data,
      },
    };
  }
);

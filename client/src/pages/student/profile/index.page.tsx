import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React from "react";

import { Student } from "@customTypes/users/student";
import { getAPIClient } from "../../../services/api/clientApi";
import { City } from "@customTypes/city";
import { Institution } from "@customTypes/institution";
import { Course } from "@customTypes/course";
import AppCard from "@components/AppCard";
import { Pencil, User } from "lucide-react";
import ContactInfoForm from "./_contact-form";
import EducationForm from "./_education-form";
import AddressForm from "./_address-form";
import withStudentAuth from "../../../services/auth/withStudentAuth";

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
            <div className="flex gap-1">
              <textarea
                name="about"
                id="about"
                placeholder="Escreva algo sobre você"
                className="textarea textarea-primary w-full"
              >
                {student?.about}
              </textarea>
              <button className="btn btn-primary self-end">Salvar</button>
            </div>
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

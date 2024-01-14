import Head from "next/head";

import { AppCard } from "../../../components";
import {
  CITIES_PATH,
  COURSES_PATH,
  INSTITUTIONS_PATH,
  PROFILE_STUDENT_PATH,
} from "../../../constants/api-routes";
import withStudentAuth from "../../../services/auth/withStudentAuth";
import { City } from "../../../types/city";
import { Course } from "../../../types/course";
import { Institution } from "../../../types/institution";
import { Student } from "../../../types/users/student";

import { getAPIClient } from "@services/api/clientApi";
import AddressForm from "./_address-form";
import ContactInfoForm from "./_contact-form";
import EducationForm from "./_education-form";
import PersonalDataForm from "./_personal-data-form";

interface StudentProfileProps {
  student: Student;
  cities: City[];
  courses: Course[];
  institutions: Institution[];
}

export default function StudentProfile({
  student,
  cities,
  courses,
  institutions,
}: StudentProfileProps) {
  return (
    <>
      <Head>
        <title>{student.name} | Dados pessoais</title>
      </Head>

      <div className="flex flex-col gap-2 w-11/12 mb-4">
        <AppCard>
          <PersonalDataForm student={student} />
        </AppCard>

        <AppCard>
          <ContactInfoForm
            initialData={{
              ...student,
            }}
          />
        </AppCard>

        <AppCard>
          <EducationForm
            institutions={institutions}
            courses={courses}
            student={student}
          />
        </AppCard>

        <AppCard>
          <AddressForm cities={cities} student={student} />
        </AppCard>
      </div>
    </>
  );
}

export const getServerSideProps = withStudentAuth(async (context, _user) => {
  const apiClient = getAPIClient(context);

  const { data: student } = await apiClient.get<Student>(PROFILE_STUDENT_PATH);

  const cities = await apiClient.get<City[]>(CITIES_PATH);
  const courses = await apiClient.get<Course[]>(COURSES_PATH, {
    params: {
      institutionId: student.institution.id,
    },
  });
  const institutions = await apiClient.get<Institution[]>(INSTITUTIONS_PATH);

  return {
    props: {
      student: student,
      cities: cities.data,
      courses: courses.data,
      institutions: institutions.data,
    },
  };
});

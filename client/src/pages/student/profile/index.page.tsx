import Head from "next/head";

import {
  CITIES_PATH,
  COURSES_PATH,
  INSTITUTIONS_PATH,
  PROFILE_STUDENT_PATH,
} from "app-constants";
import { AppCard } from "components";
import { withStudentAuth } from "services";
import { City, Course, Institution, Student } from "types";
import { errorToString } from "utils";

import { serverApi } from "services/api/serverApi";
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

export const getServerSideProps = withStudentAuth(async (context) => {
  const apiClient = serverApi(context);

  try {
    const { data: student } = await apiClient.get<Student>(
      PROFILE_STUDENT_PATH
    );
    const { data: cities } = await apiClient.get<City[]>(CITIES_PATH);
    const { data: courses } = await apiClient.get<Course[]>(COURSES_PATH, {
      params: {
        institutionId: student.institution.id,
      },
    });
    const { data: institutions } = await apiClient.get<Institution[]>(
      INSTITUTIONS_PATH
    );

    return {
      props: {
        student,
        cities,
        courses,
        institutions,
      },
    };
  } catch (error) {
    console.log(errorToString(error));
    return { props: {} };
  }
});

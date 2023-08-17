import { GetServerSideProps } from "next";
import React from "react";

import { Student } from "../../../utils/types/users/student";
import { getAPIClient } from "../../../services/api/clientApi";
import Profile from "./_profile";
import Resume from "./_resume";
import { City } from "../../../utils/types/city";
import { Institution } from "../../../utils/types/institution";
import { Course } from "../../../utils/types/course";

interface StudentProfileProps {
  student: Student;
  cities: City[];
  instituions: Institution[];
  courses: Course[];
}

export default function StudentProfile({
  student,
  cities,
  instituions,
  courses,
}: StudentProfileProps) {
  return (
    <>
      <div className="flex flex-col gap-2 w-11/12">
        {/* <Profile
          student={student}
          institutions={instituions}
          courses={courses}
          cities={cities}
        /> */}

        <Resume />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  try {
    const apiClient = getAPIClient(ctx);
    const student = await apiClient.get<Student>("/students/profile");
    const cities = await apiClient.get<City[]>("/cities");
    const instituions = await apiClient.get<Institution[]>("/institutions", {
      params: {
        cityId: student.data.city.id,
      },
    });
    const courses = await apiClient.get<Course[]>(
      `/institutions/${student.data.institution.id}/courses`
    );

    console.log(courses);

    return {
      props: {
        student: student.data,
        cities: cities.data,
        instituions: instituions.data,
        courses: courses.data,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

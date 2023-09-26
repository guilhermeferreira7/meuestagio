import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { Plus, X } from "lucide-react";

import CreateCourseForm from "./_form-create";
import ListCourses from "./_list";
import { AppCard } from "../../../components";
import {
  AREAS_PATH,
  CITIES_PATH,
  COURSES_PATH,
  INSTITUTIONS_PATH,
  PROFILE_ADMIN_PATH,
} from "../../../constants/api-routes";
import { getAPIClient } from "../../../services/api/clientApi";
import { Institution } from "../../../types/institution";
import { Area } from "../../../types/area";
import { Course } from "../../../types/course";
import { City } from "../../../types/city";
import { User } from "../../../types/users/user";

interface CreateCourseFormProps {
  institutions: Institution[];
  areas: Area[];
  courses: Course[];
}

export default function RegisterCourses({
  institutions,
  areas,
  courses,
}: CreateCourseFormProps) {
  const [create, setCreate] = useState(false);
  const [coursesUpdated, setCoursesUpdated] = useState<Course[]>(courses);

  return (
    <>
      <div className="w-11/12 flex flex-col gap-2">
        {create ? (
          <AppCard>
            <h2 className="text-xl font-bold mb-2 flex items-center justify-between">
              <span>Novo curso</span>
              <button
                className="btn btn-error"
                onClick={() => {
                  setCreate(false);
                }}
              >
                <X />
                Cancelar
              </button>
            </h2>
            <CreateCourseForm institutions={institutions} areas={areas} />
          </AppCard>
        ) : (
          <AppCard>
            <h2 className="text-xl font-bold mb-2 flex items-center justify-between">
              <span>Cursos cadastrados</span>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setCreate(true);
                }}
              >
                <Plus />
                Novo curso
              </button>
            </h2>
            <ListCourses courses={coursesUpdated} />
          </AppCard>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);

  try {
    await apiClient.get<User>(PROFILE_ADMIN_PATH);

    const cities = await apiClient.get<City[]>(CITIES_PATH, {
      params: { orderBy: "name" },
    });
    const institutions = await apiClient.get<Institution[]>(INSTITUTIONS_PATH);
    const areas = await apiClient.get<Area[]>(AREAS_PATH);
    const courses = await apiClient.get<Course[]>(COURSES_PATH, {
      params: { orderBy: "id", order: "DESC", limit: 10 },
    });

    return {
      props: {
        cities: cities.data,
        institutions: institutions.data,
        areas: areas.data,
        courses: courses.data,
      },
    };
  } catch (error: any) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

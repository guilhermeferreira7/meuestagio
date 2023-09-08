import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { Plus, X } from "lucide-react";
import { ToastContainer } from "react-toastify";

import { User } from "@customTypes/users/user";
import { City } from "@customTypes/city";
import { Institution } from "@customTypes/institution";
import { Area } from "@customTypes/area";
import { Course } from "@customTypes/course";
import { getAPIClient } from "@services/api/clientApi";

import CreateCourseForm from "./_form-create";
import EditCoursesForm from "./_list";
import AppCard from "@components/AppCard";

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
            <EditCoursesForm courses={courses} />
          </AppCard>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);

  try {
    await apiClient.get<User>("/admin/profile");

    const cities = await apiClient.get<City[]>("/cities", {
      params: { orderBy: "name" },
    });
    const institutions = await apiClient.get<Institution[]>("/institutions");
    const areas = await apiClient.get<Area[]>("/areas");
    const courses = await apiClient.get<Course[]>("/courses", {
      params: { orderBy: "id", order: "DESC" },
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

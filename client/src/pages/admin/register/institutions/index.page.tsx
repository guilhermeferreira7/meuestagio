import { useState } from "react";
import { GetServerSideProps } from "next";
import { ToastContainer } from "react-toastify";

import AppCard from "@components/AppCard";
import { getAPIClient } from "@services/api/clientApi";
import { Institution } from "@customTypes/institution";
import { User } from "@customTypes/users/user";
import { Area } from "@customTypes/area";
import { City } from "@customTypes/city";

import CreateInstitutionForm from "./_form-create";
import ListInstitutions from "./_list-institutions";

interface CreateCourseFormProps {
  cities: City[];
  institutions: Institution[];
}

export default function RegisterInstitutions({
  cities,
  institutions,
}: CreateCourseFormProps) {
  return (
    <>
      <div className="w-11/12 flex flex-col gap-2">
        <AppCard>
          <CreateInstitutionForm cities={cities} />
        </AppCard>

        <AppCard>
          <ListInstitutions institutions={institutions} />
        </AppCard>
      </div>
      <ToastContainer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    await apiClient.get<User>("/admin/profile");
    const cities = await apiClient.get<City[]>("/cities", {
      params: { orderBy: "name" },
    });
    const institutions = await apiClient.get<Institution[]>("/institutions", {
      params: {
        page: 0,
        limit: 3,
      },
    });
    const areas = await apiClient.get<Area[]>("/areas");
    return {
      props: {
        cities: cities.data,
        institutions: institutions.data,
        areas: areas.data,
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

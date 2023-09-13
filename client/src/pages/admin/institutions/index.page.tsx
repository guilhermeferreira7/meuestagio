import { useState } from "react";
import { GetServerSideProps } from "next";

import AppCard from "@components/AppCard";
import { getAPIClient } from "@services/api/clientApi";
import { Institution } from "@customTypes/institution";
import { User } from "@customTypes/users/user";
import { Area } from "@customTypes/area";
import { City } from "@customTypes/city";

import CreateInstitutionForm from "./_form-create";
import ListInstitutions from "./_list-institutions";
import { Plus, X } from "lucide-react";

interface CreateCourseFormProps {
  cities: City[];
  institutions: Institution[];
}

export default function RegisterInstitutions({
  cities,
  institutions,
}: CreateCourseFormProps) {
  const [create, setCreate] = useState(false);
  return (
    <>
      <div className="w-11/12 flex flex-col gap-2">
        {create ? (
          <AppCard>
            <h2 className="text-xl font-bold mb-2 flex items-center justify-between">
              <span>Cadastrar instituição</span>
              <button
                className="btn btn-error gap-1 flex items-center"
                onClick={() => setCreate(false)}
              >
                <X />
                Cancelar
              </button>
            </h2>
            <CreateInstitutionForm cities={cities} />
          </AppCard>
        ) : (
          <AppCard>
            <h2 className="text-xl font-bold mb-2 flex items-center justify-between">
              <span>Instituições cadastradas</span>
              <button
                className="btn btn-primary gap-1 flex items-center"
                onClick={() => setCreate(true)}
              >
                <Plus />
                Nova instituição
              </button>
            </h2>
            <ListInstitutions institutions={institutions} />
          </AppCard>
        )}
      </div>
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
        limit: 10,
        orderBy: "name",
        order: "ASC",
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

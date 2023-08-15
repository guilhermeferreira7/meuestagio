import { GetServerSideProps } from "next";
import React from "react";
import { getAPIClient } from "../../../services/api/clientApi";
import { Company } from "../../../utils/types/users/company";
import { Vacancy } from "../../../utils/types/vacancy";
import VacancyCompanyCard from "./_vacancy-card";

interface CompanyVacanciesProps {
  vacancies: Vacancy[];
}

export default function CompanyVacancies({ vacancies }: CompanyVacanciesProps) {
  return (
    <>
      <div className="w-full p-4">
        {vacancies?.map((vacancy: Vacancy) => (
          <VacancyCompanyCard key={vacancy.id} vacancy={vacancy} />
        ))}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    const company = await apiClient.get<Company>("/companies/profile");

    const vacancies = await apiClient.get<Vacancy[]>(
      `/vacancies/company/${company.data.id}`
    );

    return {
      props: {
        company: company.data,
        vacancies: vacancies.data,
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

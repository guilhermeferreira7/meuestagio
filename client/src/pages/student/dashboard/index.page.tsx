import { GetServerSideProps } from "next";

import { VACANCIES_STUDENT_LIMIT } from "@constants/request";
import { Student } from "@customTypes/users/student";
import { Job } from "@customTypes/job";
import { City } from "@customTypes/city";
import { getAPIClient } from "@services/api/clientApi";

import JobCard from "@components/Student/JobCard";
import axios from "axios";
import { useJobsListing } from "../../../hooks/useJobListing";
import { ToastContainer } from "react-toastify";
import SearchBar from "@pages/student/dashboard/_search-bar";
import { Region } from "@customTypes/region";

interface StudentPageProps {
  jobsData: Job[];
  student: Student;
  states: string[];
  initialCities: City[];
  initialRegions: Region[];
}

export default function StudentJobs({
  jobsData,
  student,
  states,
  initialCities,
  initialRegions,
}: StudentPageProps) {
  const { pageData, pageFunctions } = useJobsListing({
    jobs: jobsData,
    student,
    cities: initialCities,
    regions: initialRegions,
  });

  return (
    <>
      <SearchBar
        student={student}
        states={states}
        cities={pageData.cities}
        regions={pageData.regions}
        search={pageFunctions.search}
        onStateChange={pageFunctions.onStateChange}
        onRegionChange={pageFunctions.onRegionChange}
        onCityChange={pageFunctions.onCityChange}
        setIsRemote={pageFunctions.setIsRemote}
      />

      <div className="w-11/12 flex flex-col gap-2 mx-8 mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span>
            {pageData.filters.city
              ? `Vagas em ${pageData.cityName} (cidade)`
              : pageData.filters.state
              ? `Vagas em ${pageData.filters.state} (estado)`
              : pageData.filters.region
              ? `Vagas em ${pageData.regionName} (região)`
              : "Vagas em todo o Brasil"}
            {pageData.filters.isRemote && " (remoto)"}
            {pageData.currentSearch && ` de ${pageData.currentSearch}`}
          </span>
          <button
            className="text-error underline font-semibold"
            onClick={pageFunctions.cleanFilters}
          >
            Remover filtros
          </button>
        </h2>
        {pageData.jobs.length > 0 ? (
          pageData.jobs.map((job: Job) => (
            <div key={job.id}>
              <JobCard job={job} />
            </div>
          ))
        ) : (
          <div className="p-10 self-center">
            <h1 className="text-xl">
              Nenhuma vaga encontrada, tente mudar os filtros{" "}
            </h1>
          </div>
        )}
        {pageData.hasMoreJobs && (
          <button
            className="btn btn-primary w-1/2 self-center"
            onClick={pageFunctions.moreJobs}
          >
            Ver mais
          </button>
        )}
      </div>

      <ToastContainer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    const student = await apiClient.get<Student>("/students/profile");
    const cities = await apiClient.get<City[]>("/cities");
    const states: any = [];
    cities.data.forEach((city) => {
      if (!states.includes(city.state)) {
        states.push(city.state);
      }
    });
    const initialCities = cities.data.filter(
      (city) => city.state === student.data.city.state
    );

    const jobs = await apiClient.get<Job[]>("/jobs", {
      params: {
        limit: VACANCIES_STUDENT_LIMIT,
        city: student.data.city.id,
      },
    });

    const regions = await apiClient.get<Region[]>("cities/regions", {
      params: {
        state: student.data.city.state,
      },
    });

    return {
      props: {
        jobsData: jobs.data,
        initialCities,
        initialRegions: regions.data,
        states,
        student: student.data,
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    }
  }

  return {
    props: {},
  };
};

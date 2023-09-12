import { GetServerSideProps } from "next";
import { ToastContainer } from "react-toastify";

import { VACANCIES_STUDENT_LIMIT } from "@constants/request";
import { Student } from "@customTypes/users/student";
import { Job } from "@customTypes/job";
import { getAPIClient } from "@services/api/clientApi";

import { isAxiosError } from "axios";
import { useJobsListing } from "../../../hooks/useJobListing";
import SearchBar from "./_search-bar";
import JobCardStudent from "./_job-card-student";

interface StudentPageProps {
  jobsData: Job[];
  student: Student;
  states: string[];
}

export default function StudentJobs({ jobsData, student }: StudentPageProps) {
  const { pageData, pageFunctions } = useJobsListing({
    jobs: jobsData,
    student,
  });

  return (
    <>
      <SearchBar
        cities={pageData.cities}
        regions={pageData.regions}
        search={pageFunctions.search}
        onStateChange={pageFunctions.onStateChange}
        onRegionChange={pageFunctions.onRegionChange}
        onCityChange={pageFunctions.onCityChange}
        setIsRemote={pageFunctions.setIsRemote}
        cleanFilters={pageFunctions.cleanFilters}
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
        </h2>
        {pageData.jobs.length > 0 ? (
          pageData.jobs.map((job: Job) => (
            <div key={job.id}>
              <JobCardStudent job={job} />
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
    const jobs = await apiClient.get<Job[]>("/jobs", {
      params: {
        limit: VACANCIES_STUDENT_LIMIT,
        city: student.data.city.id,
      },
    });

    return {
      props: {
        jobsData: jobs.data,
        student: student.data,
      },
    };
  } catch (error) {
    if (isAxiosError(error)) {
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

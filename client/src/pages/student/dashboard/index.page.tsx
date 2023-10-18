import Head from "next/head";

import { useJobsListing } from "../../../hooks/useJobListing";
import withStudentAuth from "../../../services/auth/withStudentAuth";
import { Job } from "../../../types/job";
import { Student } from "../../../types/users/student";

import SearchBar from "./_search-bar";
import JobCardStudent from "./_job-card-student";

interface StudentJobsProps {
  student: Student;
}

export default function StudentJobs({ student }: StudentJobsProps) {
  const { pageData, pageFunctions } = useJobsListing();

  return (
    <>
      <Head>
        <title>Vagas de estágio</title>
      </Head>

      <SearchBar
        cities={pageData.cities}
        regions={pageData.regions}
        search={pageFunctions.search}
        onStateChange={pageFunctions.onStateChange}
        onRegionChange={pageFunctions.onRegionChange}
        onCityChange={pageFunctions.onCityChange}
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
            {pageData.currentSearch && ` de ${pageData.currentSearch}`}
          </span>
        </h2>
        {pageData.jobs.length > 0 ? (
          pageData.jobs.map((job: Job) => (
            <div key={job.id}>
              <JobCardStudent job={job} areaId={student.course.areaId} />
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
    </>
  );
}

export const getServerSideProps = withStudentAuth(
  async (_context, student, _apiClient) => {
    return {
      props: {
        student,
      },
    };
  }
);

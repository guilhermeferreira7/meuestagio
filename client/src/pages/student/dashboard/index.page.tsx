import Head from "next/head";

import { PROFILE_STUDENT_PATH } from "app-constants";
import { useJobsListing } from "hooks";
import { serverApi, withStudentAuth } from "services";
import { Job, Student } from "types";
import { errorToString } from "utils";

import JobCardStudent from "./_job-card-student";
import SearchBar from "./_search-bar";

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
            {pageData.currentSearch && ` de '${pageData.currentSearch}'`}
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

export const getServerSideProps = withStudentAuth(async (context, _user) => {
  const apiClient = serverApi(context);

  try {
    const student = await apiClient.get<Student>(PROFILE_STUDENT_PATH);

    return {
      props: {
        student: student.data,
      },
    };
  } catch (error) {
    console.log(errorToString(error));
    return {
      props: {},
    };
  }
});

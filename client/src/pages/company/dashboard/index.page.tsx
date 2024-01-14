import { Job, JobStatus } from "@customTypes/job";
import { getAPIClient } from "@services/api/clientApi";
import withCompanyAuth from "@services/auth/withCompanyAuth";
import { useEffect, useState } from "react";
import { AppTabs } from "../../../components";
import { JOBS_BY_COMPANY_PATH } from "../../../constants/api-routes";
import JobCompanyCard from "./_job-card";

interface CompanyJobsProps {
  jobs: Job[];
}

export default function CompanyJobs({ jobs }: CompanyJobsProps) {
  const [tab, setTab] = useState<string>("Abertas");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);

  useEffect(() => {
    if (tab === "Abertas") {
      setFilteredJobs(jobs.filter((job) => job.status === JobStatus.OPEN));
    } else {
      setFilteredJobs(jobs.filter((job) => job.status === JobStatus.CLOSED));
    }
  }, [tab, jobs]);

  return (
    <>
      <div className="w-full flex flex-col gap-2 items-center">
        <h1 className="text-2xl text-center">
          {jobs?.length === 0
            ? "Você ainda não cadastrou nenhuma vaga"
            : "Vagas cadastradas"}
        </h1>

        {jobs?.length > 0 && (
          <AppTabs
            tabs={["Abertas", "Encerradas"]}
            activeTab={tab}
            setActiveTab={setTab}
          />
        )}

        {filteredJobs?.length === 0 && (
          <h2 className="text-xl text-center">
            {`Não há vagas ${tab === "Abertas" ? "abertas" : "encerradas"}`}
          </h2>
        )}

        {filteredJobs?.map((job: Job) => (
          <div className="w-11/12" key={job.id}>
            <JobCompanyCard job={job} />
          </div>
        ))}
      </div>
    </>
  );
}

export const getServerSideProps = withCompanyAuth(async (context, user) => {
  const apiClient = getAPIClient(context);

  const jobs = await apiClient.get<Job[]>(
    JOBS_BY_COMPANY_PATH(Number(user.sub))
  );

  return {
    props: {
      jobs: jobs.data,
    },
  };
});

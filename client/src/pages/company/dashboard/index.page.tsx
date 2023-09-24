import { GetServerSideProps } from "next";

import { Company } from "@customTypes/users/company";
import { Job } from "@customTypes/job";
import { getAPIClient } from "@services/api/clientApi";
import JobCompanyCard from "./_job-card";

interface CompanyJobsProps {
  jobs: Job[];
}

export default function CompanyJobs({ jobs }: CompanyJobsProps) {
  return (
    <>
      <div className="w-full p-4 flex flex-col gap-2">
        {jobs?.length === 0 && (
          <h1 className="text-2xl text-center">
            Você ainda não cadastrou nenhuma vaga
          </h1>
        )}

        {jobs?.map((job: Job) => (
          <JobCompanyCard key={job.id} job={job} />
        ))}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);

    const company = await apiClient.get<Company>("/companies/profile");
    const jobs = await apiClient.get<Job[]>(`/jobs/company/${company.data.id}`);

    return {
      props: {
        company: company.data,
        jobs: jobs.data,
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

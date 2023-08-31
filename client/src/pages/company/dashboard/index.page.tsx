import { GetServerSideProps } from "next";
import React from "react";

import { getAPIClient } from "../../../services/api/clientApi";
import { Company } from "../../../utils/types/users/company";
import { Job } from "../../../utils/types/job";
import JobCompanyCard from "../../../components/Company/JobCompanyCard";

interface CompanyJobsProps {
  jobs: Job[];
}

export default function CompanyJobs({ jobs }: CompanyJobsProps) {
  return (
    <>
      <div className="w-full p-4 flex flex-col gap-2">
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

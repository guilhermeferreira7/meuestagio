import { GetServerSideProps } from "next";
import React from "react";

import { getAPIClient } from "../../../../services/api/clientApi";
import { Company } from "../../../../utils/types/users/company";
import { JobApplication } from "../../../../utils/types/job-application";
import AppCard from "../../../../components/AppCard";

interface ApplicationsProps {
  jobApplications: JobApplication[];
}

export default function Applications({ jobApplications }: ApplicationsProps) {
  return (
    <>
      {!jobApplications ? (
        <h2 className="text-xl font-semibold">Nenhum candidato ainda</h2>
      ) : (
        <div className="w-11/12 flex flex-col gap-1">
          {jobApplications.map((jobApplication) => (
            <AppCard key={jobApplication.id}>
              <div className="flex flex-col gap-1">
                <span>
                  {jobApplication.resume.title
                    ? jobApplication.resume.title
                    : "titulo"}{" "}
                </span>
                <span>
                  {jobApplication.resume.about
                    ? jobApplication.resume.about
                    : "descrição"}
                </span>
                <span>{jobApplication.student.name}</span>
                {jobApplication.resume.skills &&
                  jobApplication.resume.skills.map((skill) => (
                    <React.Fragment key={skill.id}>
                      <span>{skill.name}</span>
                      <span>{skill.level}</span>
                    </React.Fragment>
                  ))}
              </div>
            </AppCard>
          ))}
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    await apiClient.get<Company>("/companies/profile");
    const jobApplications = await apiClient.get<JobApplication[]>(
      "/job-applications/company",
      {
        params: {
          vacancyId: ctx.query.id,
        },
      }
    );

    return {
      props: {
        jobApplications: jobApplications.data,
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

import { useState } from "react";

import {
  JOBS_BY_COMPANY_PATH,
  JOB_APPLICATIONS_COMPANY_PATH,
} from "../../../constants/api-routes";
import withCompanyAuth from "../../../services/auth/withCompanyAuth";
import {
  JobApplication,
  JobApplicationStatus,
} from "../../../types/job-application";
import { Job } from "../../../types/job";
import { AppCard, ResumeView } from "../../../components";

type CandidatesPageProps = {
  candidates: JobApplication[];
};

export default function Candidates({ candidates }: CandidatesPageProps) {
  const [currentCandidate, setCurrentCandidate] =
    useState<JobApplication | null>(null);

  if (currentCandidate) {
    return (
      <div className="w-11/12">
        <div className="flex justify-end gap-1 pb-2">
          <button
            className="btn btn-success"
            onClick={() => setCurrentCandidate(null)}
          >
            Agendar entrevista
          </button>
          <button
            className="btn btn-error"
            onClick={() => setCurrentCandidate(null)}
          >
            Rejeitar
          </button>
          <button
            className="btn btn-info"
            onClick={() => setCurrentCandidate(null)}
          >
            Ver outros candidatos
          </button>
        </div>
        <ResumeView
          resume={currentCandidate.resume}
          student={currentCandidate.student}
          key={currentCandidate.id}
        />
      </div>
    );
  }

  return (
    <>
      {candidates.map((candidate) => (
        <div className="w-11/12" key={candidate.id}>
          <AppCard>
            <div>{candidate.student.name}</div>
            <div>{candidate.student.about}</div>
            <div>{candidate.message}</div>
            <button
              className="btn btn-primary"
              onClick={() => setCurrentCandidate(candidate)}
            >
              Ver currículo
            </button>
          </AppCard>
        </div>
      ))}
    </>
  );
}

export const getServerSideProps = withCompanyAuth(
  async (_context, company, apiClient) => {
    const jobs = await apiClient.get<Job[]>(JOBS_BY_COMPANY_PATH(company.id));

    const candidates = await Promise.all(
      jobs.data.map(async (job) => {
        return apiClient
          .get<JobApplication[]>(JOB_APPLICATIONS_COMPANY_PATH, {
            params: {
              jobId: job.id,
            },
          })
          .then((res) => {
            return res.data.filter(
              (jobApplication) =>
                jobApplication.status === JobApplicationStatus.INTERVIEW
            );
          });
      })
    );

    return {
      props: {
        candidates: candidates.flat(),
      },
    };
  }
);

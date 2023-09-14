import Link from "next/link";

import withStudentAuth from "../../../services/auth/withStudentAuth";
import { getAPIClient } from "../../../services/api/clientApi";
import { JobApplication } from "../../../types/job-application";
import AppCard from "../../../components/AppCard";

interface JobApplicationsProps {
  jobApplications: JobApplication[];
}

export default function JobApplicationsPage({
  jobApplications,
}: JobApplicationsProps) {
  return (
    <>
      <h2 className="text-xl mb-4">Minhas candidaturas</h2>
      <div className="flex flex-col gap-1 w-11/12">
        {jobApplications.length === 0 && (
          <>
            <h2 className="text-lg">
              Você ainda não se candidatou a nenhuma vaga.
            </h2>
          </>
        )}
        {jobApplications.map((jobApplication) => {
          return (
            <AppCard key={jobApplication.id}>
              <div className="flex justify-between items-center">
                <div className="w-1/2 flex flex-col gap-1 ">
                  <h2>Vaga: {jobApplication.job.title}</h2>
                  <h2>Empresa: {jobApplication.job.company.name}</h2>
                </div>
                <div className="w-1/2 flex flex-col gap-1 ">
                  <Link
                    href={`job/${jobApplication.job.id}`}
                    className="btn btn-sm btn-primary"
                  >
                    Detalhes
                  </Link>
                  <button className="btn btn-sm btn-error">Desistir</button>
                </div>
              </div>
            </AppCard>
          );
        })}
      </div>
    </>
  );
}

export const getServerSideProps = withStudentAuth(
  async (_context, student, apiClient) => {
    const jobApplications = await apiClient.get("/job-applications/student", {
      params: {
        studentId: student.id,
      },
    });
    return {
      props: {
        jobApplications: jobApplications.data,
      },
    };
  }
);

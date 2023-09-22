import Link from "next/link";
import { useRouter } from "next/router";

import AppCard from "../../../components/AppCard";
import AppTabs from "../../../components/AppTabs";
import { notify } from "../../../components/toasts/toast";
import { useJobApplications } from "../../../hooks/useFilterJobApplications";
import { api } from "../../../services/api/api";
import withStudentAuth from "../../../services/auth/withStudentAuth";
import {
  JobApplication,
  JobApplicationStatus,
} from "../../../types/job-application";
import { errorToString } from "../../../utils/helpers/error-to-string";

interface JobApplicationsProps {
  jobApplications: JobApplication[];
}

export default function JobApplicationsPage({
  jobApplications,
}: JobApplicationsProps) {
  const { jobs, activeTab, setActiveTab } = useJobApplications({
    jobApplications,
    defaultTab: JobApplicationStatus.IN_PROGRESS,
  });

  const router = useRouter();

  const withdraw = (jobApplication: JobApplication) => {
    if (
      !confirm(
        "Deseja realmente desistir dessa vaga? \nEsta ação é irreversível!"
      )
    )
      return;

    api
      .post("/job-applications/withdraw", {
        jobApplicationId: jobApplication.id,
      })
      .then(() => {
        notify.success("Candidatura desistida com sucesso");
        router.reload();
      })
      .catch((error) => {
        notify.error(errorToString(error));
      });
  };

  return (
    <>
      <h2 className="text-xl mb-4">Minhas candidaturas</h2>
      <AppTabs
        tabs={[
          JobApplicationStatus.IN_PROGRESS,
          JobApplicationStatus.APPROVED,
          JobApplicationStatus.REJECTED,
          JobApplicationStatus.FINISHED,
          JobApplicationStatus.CANCELED_BY_STUDENT,
        ]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex flex-col gap-1 w-11/12">
        {jobs.length === 0 && (
          <>
            <h2 className="text-lg">
              Você não possui candidaturas nessa categoria.
            </h2>
          </>
        )}
        {jobs.map((jobApplication) => {
          return (
            <AppCard key={jobApplication.id}>
              <div className="flex justify-between items-center">
                <div className="w-1/2 flex flex-col gap-1 ">
                  <h2>Vaga: {jobApplication.job.title}</h2>
                  <h2>Empresa: {jobApplication.job.company.name}</h2>
                </div>
                <div className="w-1/2 flex flex-col gap-1 ">
                  <Link
                    href={`job-details/${jobApplication.job.id}`}
                    className="btn btn-sm btn-primary"
                  >
                    Detalhes
                  </Link>
                  {jobApplication.status ===
                    JobApplicationStatus.IN_PROGRESS && (
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => withdraw(jobApplication)}
                    >
                      Desistir
                    </button>
                  )}
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

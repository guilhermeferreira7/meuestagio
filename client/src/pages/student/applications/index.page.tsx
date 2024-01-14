import Link from "next/link";
import { useRouter } from "next/router";

import { getAPIClient } from "@services/api/clientApi";
import { AppCard, AppTabs } from "../../../components";
import { notify } from "../../../components/toasts/toast";
import {
  JOB_APPLICATIONS_FINISH_PATH,
  JOB_APPLICATIONS_STUDENT_PATH,
} from "../../../constants/api-routes";
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

  const cancel = (jobApplication: JobApplication) => {
    if (
      !confirm(
        "Deseja realmente desistir dessa vaga? \nEsta ação é irreversível!"
      )
    )
      return;

    api
      .post(JOB_APPLICATIONS_FINISH_PATH, {
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
          JobApplicationStatus.INTERVIEW,
          JobApplicationStatus.FINISHED,
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
                      onClick={() => cancel(jobApplication)}
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

export const getServerSideProps = withStudentAuth(async (context, user) => {
  const apiClient = getAPIClient(context);

  const jobApplications = await apiClient.get<JobApplication[]>(
    JOB_APPLICATIONS_STUDENT_PATH,
    {
      params: {
        studentId: user.sub,
      },
    }
  );
  return {
    props: {
      jobApplications: jobApplications.data,
    },
  };
});

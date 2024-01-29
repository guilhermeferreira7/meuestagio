import Link from "next/link";

import {
  JOB_APPLICATIONS_FINISH_PATH,
  JOB_APPLICATIONS_STUDENT_PATH,
} from "app-constants";
import { AppCard, AppTabs, notify } from "components";
import { useJobApplications } from "hooks";
import { api, serverApi, withStudentAuth } from "services";
import { JobApplication, JobApplicationStatus } from "types";
import { errorToString } from "utils";

interface JobApplicationsProps {
  jobApplications: JobApplication[];
}

export default function JobApplicationsPage({
  jobApplications,
}: JobApplicationsProps) {
  const { jobs, activeTab, setActiveTab, setJobs } = useJobApplications({
    jobApplications,
    defaultTab: JobApplicationStatus.IN_PROGRESS,
  });

  const cancel = async (jobApplication: JobApplication) => {
    if (
      !confirm(
        "Deseja realmente desistir dessa vaga? \nEsta ação é irreversível!"
      )
    )
      return;
    try {
      await api.patch(JOB_APPLICATIONS_FINISH_PATH, {
        jobApplicationId: jobApplication.id,
      });
      notify.success("Candidatura desistida");
      const jobsUpdate = jobs.filter((job) => job.id !== jobApplication.id);

      setJobs(jobsUpdate);
    } catch (error) {
      notify.error(errorToString(error));
    }
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

export const getServerSideProps = withStudentAuth(async (context) => {
  const apiClient = serverApi(context);

  try {
    const { data: jobApplications } = await apiClient.get<JobApplication[]>(
      JOB_APPLICATIONS_STUDENT_PATH
    );
    return {
      props: {
        jobApplications,
      },
    };
  } catch (error) {
    console.log(errorToString(error));
    return { props: {} };
  }
});

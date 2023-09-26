import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { AppTabs, Modal, ResumeView } from "../../../../components";
import { notify } from "../../../../components/toasts/toast";
import {
  JOB_APPLICATIONS_COMPANY_PATH,
  JOB_APPLICATIONS_FINISH_PATH,
  JOB_APPLICATIONS_INTERVIEW_PATH,
  PROFILE_COMPANY_PATH,
} from "../../../../constants/api-routes";
import { useJobApplications } from "../../../../hooks/useFilterJobApplications";
import { getAPIClient } from "../../../../services/api/clientApi";
import {
  JobApplication,
  JobApplicationStatus,
} from "../../../../types/job-application";
import { Company } from "../../../../types/users/company";
import Candidate from "./_candidate";
import { api } from "../../../../services/api/api";
import { errorToString } from "../../../../utils/helpers/error-to-string";

interface ApplicationsProps {
  jobApplications: JobApplication[];
}

export default function Applications({ jobApplications }: ApplicationsProps) {
  const router = useRouter();
  const [currentCandidate, setCurrentCandidate] =
    useState<JobApplication | null>(null);
  const { jobs, activeTab, setActiveTab } = useJobApplications({
    jobApplications,
    defaultTab: JobApplicationStatus.IN_PROGRESS,
  });

  if (jobApplications.length < 1) {
    return (
      <h2 className="text-xl font-semibold">
        Você não possui candidaturas nessa vaga
      </h2>
    );
  }

  if (currentCandidate) {
    return (
      <div className="w-11/12">
        <div className="flex justify-end gap-1 mb-1">
          {currentCandidate.status === JobApplicationStatus.IN_PROGRESS ? (
            <>
              <button
                className="btn btn-success text-white"
                onClick={setAproved}
              >
                Aceitar
              </button>
              <button className="btn btn-error" onClick={setRejected}>
                Rejeitar
              </button>
            </>
          ) : currentCandidate.status === JobApplicationStatus.INTERVIEW ? (
            <>
              <Modal.Button id="modal-contact">Contato</Modal.Button>
              <Modal.Content id="modal-contact">
                <div className="flex flex-col">
                  <span>
                    Telefone:{" "}
                    {currentCandidate.student.phone
                      ? currentCandidate.student.phone
                      : "Não informado"}
                  </span>
                  <span>
                    Email:{" "}
                    <Link
                      className="underline text-blue-400"
                      href={`mailto:${currentCandidate.student.email}`}
                    >
                      {currentCandidate.student.email}
                    </Link>
                  </span>
                </div>
              </Modal.Content>
            </>
          ) : null}
          <button
            className="btn btn-primary mb-1"
            onClick={() => setCurrentCandidate(null)}
          >
            Ver outros candidatos
          </button>
        </div>
        <ResumeView
          student={currentCandidate.student}
          resume={currentCandidate.resume}
        />
      </div>
    );
  }

  function setAproved() {
    if (
      !confirm(
        "Tem certeza que deseja aprovar esse candidato? \nEsta ação não poderá ser desfeita!"
      )
    )
      return;
    try {
      api.post(JOB_APPLICATIONS_INTERVIEW_PATH, {
        jobApplicationId: currentCandidate?.id,
      });
      notify.success("Candidatura aprovada com sucesso!");
      router.reload();
    } catch (error) {
      notify.error(errorToString(error));
    }
  }

  function setRejected() {
    if (
      !confirm(
        "Tem certeza que deseja rejeitar esse candidato? \nEsta ação não poderá ser desfeita!"
      )
    )
      return;
    try {
      api.post(JOB_APPLICATIONS_FINISH_PATH, {
        jobApplicationId: currentCandidate?.id,
      });
      notify.success("Candidatura rejeitada com sucesso!");
      router.reload();
    } catch (error) {
      notify.error(errorToString(error));
    }
  }

  return (
    <>
      <div className="w-11/12 flex items-center justify-between text-xl font-semibold pl-4 pb-4">
        <h2>Candidatos para a vaga: {router.query.job}</h2>
      </div>
      <AppTabs
        activeTab={activeTab}
        tabs={[
          JobApplicationStatus.IN_PROGRESS,
          JobApplicationStatus.INTERVIEW,
          JobApplicationStatus.FINISHED,
        ]}
        setActiveTab={setActiveTab}
      />
      {jobs.length < 1 ? (
        <h2 className="text-xl font-semibold">
          Você não possui candidaturas nessa categoria.
        </h2>
      ) : (
        <div className="w-11/12 flex flex-col gap-1">
          {jobs.map((jobApplication) => (
            <Candidate
              key={jobApplication.id}
              jobApplication={jobApplication}
              setCurrentCandidate={setCurrentCandidate}
            />
          ))}
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    await apiClient.get<Company>(PROFILE_COMPANY_PATH);
    const jobApplications = await apiClient.get<JobApplication[]>(
      JOB_APPLICATIONS_COMPANY_PATH,
      {
        params: {
          jobId: ctx.query.id,
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

import { GetServerSideProps } from "next";
import React, { useState } from "react";

import ResumeView from "../../../../components/Resume/resume";
import AppTabs from "../../../../components/AppTabs";
import { useJobApplications } from "../../../../hooks/useFilterJobApplications";
import { getAPIClient } from "../../../../services/api/clientApi";
import {
  JobApplication,
  JobApplicationStatus,
} from "../../../../types/job-application";
import { Company } from "../../../../types/users/company";
import Candidate from "./_candidate";
import { api } from "../../../../services/api/api";
import { notify } from "../../../../components/toasts/toast";
import { errorToString } from "../../../../utils/helpers/error-to-string";
import { useRouter } from "next/router";
import { Modal } from "../../../../components/AppModal/Modal";
import Link from "next/link";

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
          ) : currentCandidate.status === JobApplicationStatus.APPROVED ? (
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
      api.post("job-applications/approve", {
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
      api.post("job-applications/reject", {
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
        <Modal.Button type="error" id="modal-closeJob">
          Encerrar vaga
        </Modal.Button>
        <Modal.Content
          id="modal-closeJob"
          cancelText="Cancelar"
          confirmAction={() => {}}
          confirmText="Encerrar Vaga"
        >
          <span>Tem certeza que deseja encerrar a vaga?</span>
        </Modal.Content>
      </div>
      <AppTabs
        activeTab={activeTab}
        tabs={[
          JobApplicationStatus.IN_PROGRESS,
          JobApplicationStatus.APPROVED,
          JobApplicationStatus.REJECTED,
          JobApplicationStatus.CANCELED_BY_STUDENT,
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
    await apiClient.get<Company>("/companies/profile");
    const jobApplications = await apiClient.get<JobApplication[]>(
      "/job-applications/company",
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

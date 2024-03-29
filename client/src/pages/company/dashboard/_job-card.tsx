import Link from "next/link";

import { JOB_CLOSE_PATH } from "app-constants";
import { AppCard, Modal, notify } from "components";
import { api } from "services";
import { Job, JobStatus } from "types";
import { errorToString } from "utils";

type JobCompanyCardProps = {
  job: Job;
};

export default function JobCompanyCard({ job }: JobCompanyCardProps) {
  const closeJob = async () => {
    try {
      await api.patch(JOB_CLOSE_PATH(job.id));
      notify.success("Vaga encerrada com sucesso");
      document.getElementById(`job-modal-${job.id}`)?.click();
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  return (
    <>
      <AppCard>
        <div className="flex flex-col md:flex-row gap-1 justify-between">
          <div className="flex flex-col items-start text-xl">
            <h2 className="flex justify-between text-2xl">
              {job.title} - {job.remote ? "Remoto" : "Presencial"} - Código:{" "}
              {job.id}
            </h2>
            <p>
              Local: {job.city.name} - {job.state}
            </p>
            <p>Palavras chave: {job.keywords}</p>
          </div>
          <div className="flex flex-col gap-1 justify-center">
            {job.status === JobStatus.OPEN && (
              <Modal.Button type="error" id={`job-modal-${job.id}`}>
                Encerrar vaga
              </Modal.Button>
            )}
            <Modal.Content
              id={`job-modal-${job.id}`}
              cancelText="Cancelar"
              confirmAction={closeJob}
              confirmText="Encerrar Vaga"
            >
              <span>Tem certeza que deseja encerrar a vaga {job.title}?</span>
            </Modal.Content>
            <Link
              href={`job-applications/${job.id}?job=${job.title}`}
              className="btn btn-primary"
            >
              Ver Candidatos
            </Link>
          </div>
        </div>
      </AppCard>
    </>
  );
}

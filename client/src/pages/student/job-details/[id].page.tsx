import {
  AttachMoney,
  PlaceOutlined,
  PsychologyOutlined,
  Tag,
} from "@mui/icons-material";
import Image from "next/image";
import { useState } from "react";

import {
  JOB_APPLICATIONS_APPLY,
  JOB_APPLICATIONS_STUDENT_PATH,
  JOB_PATH,
  PROFILE_STUDENT_PATH,
} from "app-constants";
import { Modal, notify } from "components";
import { api, serverApi, withStudentAuth } from "services";
import { Job, JobApplication, Student } from "types";
import { errorToString } from "utils";

type JobDetailsPageProps = {
  studentId: number;
  resumeId: number;
  job: Job;
  applied: boolean;
};

export default function JobDetailsPage({
  studentId,
  resumeId,
  job,
  applied,
}: JobDetailsPageProps) {
  const [jobApplied, setApplied] = useState<boolean>(applied);
  const [message, setMessage] = useState<string>("");

  const apply = async () => {
    try {
      await api.post(JOB_APPLICATIONS_APPLY, {
        studentId: studentId,
        message: message,
        jobId: job.id,
        resumeId,
      });
      document.getElementById("modal")?.click();
      notify.success("Candidatura realizada com sucesso!");
      setApplied(true);
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  return (
    <>
      <div className="w-full px-6">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold py-3">
            {job.title} - {job.remote ? "Remoto" : "Presencial"} - Código da
            vaga: {job.id}
          </h2>

          {jobApplied ? (
            <h2 className="m-2 text-sm lg:text-xl font-bold text-primary">
              Já se candidatou a essa vaga!
            </h2>
          ) : (
            <Modal.Button id="modal">Quero me candidatar</Modal.Button>
          )}
        </div>
        <div className="lg:flex flex-row">
          <div className="lg:w-2/3">
            <h2 className="text-xl jobDescription">
              Sobre a vaga:
              <div>
                <div
                  className="text-xl"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>
            </h2>
          </div>
          <div className="divider divider-horizontal"></div>

          <div className="lg:w-1/3 text-xl">
            <h2 className="flex items-center gap-1">
              {job.company?.imageUrl && (
                <Image
                  className="rounded-lg"
                  src={job.company.imageUrl}
                  height={50}
                  width={50}
                  alt="Foto da empresa"
                />
              )}
              {job.company?.name}
            </h2>
            <h2 className="flex items-center gap-1">
              <PsychologyOutlined className="text-yellow-500" />
              {job.area?.title}
            </h2>
            <h2 className="flex items-center gap-1">
              <AttachMoney className="text-green-500" />
              {job.salary ? (
                <span>R$ {job.salary},00</span>
              ) : (
                <span>Salário não informado</span>
              )}
            </h2>
            <h2 className="flex items-center gap-1">
              <PlaceOutlined className="text-red-500" /> {job.city?.name}
            </h2>

            <h2 className="flex items-center gap-1">
              <Tag className="text-primary" />
              <p>
                {job.keywords?.split(", ").map((keyword: any, index: any) => (
                  <span
                    key={index}
                    className="font-semibold text-primary inline-block mr-4 underline"
                  >
                    {keyword}{" "}
                  </span>
                ))}
              </p>
            </h2>
          </div>
        </div>
      </div>

      <Modal.Content
        id="modal"
        confirmText="Candidate-se"
        confirmAction={apply}
        cancelText="Cancelar"
      >
        <p>
          Se quiser, também envie uma mensagem para o recrutador junto com seu
          currículo:
        </p>
        <textarea
          className="textarea textarea-primary h-24 w-full"
          placeholder="Escreva aqui sua mensagem"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="modal-action"></div>
      </Modal.Content>
    </>
  );
}

export const getServerSideProps = withStudentAuth(async (context) => {
  const apiClient = serverApi(context);

  try {
    const { data: student } = await apiClient.get<Student>(
      PROFILE_STUDENT_PATH
    );

    const { data: jobApplications } = await apiClient.get<JobApplication[]>(
      JOB_APPLICATIONS_STUDENT_PATH,
      {
        params: {
          studentId: student.id,
        },
      }
    );
    const { data: job } = await apiClient.get<Job>(
      JOB_PATH(Number(context.query.id))
    );

    let applied = false;
    jobApplications.forEach((jobApplication) => {
      if (jobApplication.job.id === Number(context.query.id)) {
        applied = true;
      }
    });

    return {
      props: {
        studentId: student.id,
        resumeId: student.resumeId,
        job,
        applied,
      },
    };
  } catch (error) {
    console.log(errorToString(error));
    return { props: {} };
  }
});

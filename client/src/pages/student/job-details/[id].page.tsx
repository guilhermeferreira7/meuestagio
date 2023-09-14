import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Banknote, Building, GraduationCap, Hash, MapPin } from "lucide-react";

import { notify } from "../../../components/toasts/toast";
import { api } from "../../../services/api/api";
import withStudentAuth from "../../../services/auth/withStudentAuth";
import { Job } from "../../../types/job";
import { JobApplication } from "../../../types/job-application";
import { errorToString } from "../../../utils/helpers/error-to-string";

type JobDetailsPageProps = {
  studentId: number;
  resumeId: number;
  applied: boolean;
};

export default function JobDetailsPage({
  studentId,
  resumeId,
  applied,
}: JobDetailsPageProps) {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<Job | null>(null);
  const [jobApplied, setApplied] = useState<boolean>(applied);

  useEffect(() => {
    api
      .get<Job>(`/jobs/${id}`)
      .then((response) => {
        setJob(response.data);
      })
      .catch((error) => {
        notify.error(errorToString(error));
      });
  }, [id]);

  if (!job) {
    return <h1>Carregando...</h1>;
  }

  const apply = async () => {
    try {
      await api.post("job-applications/apply", {
        studentId: studentId,
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
      <div className="w-full p-2">
        <div className="card card-bordered p-3 w-full">
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
              <label
                htmlFor="modal"
                className="btn btn-sm h-12 btn-primary text-sm lg:text-xl m-2 normal-case"
              >
                Quero me candidatar
              </label>
            )}
          </div>
          <div className="lg:flex flex-row">
            <div className="lg:w-1/3 text-xl">
              <h2 className="flex items-center gap-1">
                <GraduationCap />
                {job.area?.title}
              </h2>
              <h2 className="flex items-center gap-1">
                <Building />
                {job.company?.name}
              </h2>
              <h2 className="flex items-center gap-1">
                <Banknote />{" "}
                {job.salary ? (
                  <span className="font-semibold">R$ {job.salary},00</span>
                ) : (
                  <span>Salário não informado</span>
                )}
              </h2>
              <h2 className="flex items-center gap-1">
                <MapPin /> {job.city?.name}
              </h2>

              <h2 className="flex items-center gap-1">
                <Hash />
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
            <div className="divider divider-horizontal"></div>

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
          </div>
        </div>
      </div>

      <input type="checkbox" id="modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <p className="text-lg font-bold">
            Tem certeza que deseja se candidatar a vaga?
          </p>
          <p>
            Ou{" "}
            <Link
              href={`/student/resume?job=${job.id}`}
              className="text-blue-500 underline"
            >
              Atualize seu currículo
            </Link>
          </p>
          <div className="modal-action">
            <label htmlFor="modal" className="btn btn-warning">
              Cancelar
            </label>
            <button className="btn btn-info" onClick={apply}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withStudentAuth(
  async (context, student, apiClient) => {
    const jobApplications = await apiClient.get<JobApplication[]>(
      "job-applications/student",
      {
        params: {
          studentId: student.id,
        },
      }
    );
    let applied = false;

    if (
      jobApplications.data.some(
        (jobApplication) => jobApplication.job.id === Number(context.query.id)
      )
    ) {
      applied = true;
    }

    return {
      props: {
        studentId: student.id,
        resumeId: student.resumeId,
        applied,
      },
    };
  }
);

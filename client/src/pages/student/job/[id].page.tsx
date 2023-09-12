import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Banknote, Building, GraduationCap, Hash, MapPin } from "lucide-react";

import { getAPIClient } from "../../../services/api/clientApi";
import { api } from "../../../services/api/api";
import { Job } from "@customTypes/job";
import { Student } from "@customTypes/users/student";
import { Resume } from "@customTypes/resume";
import { JobApplication } from "@customTypes/job-application";
import { notify, notifyError, notifySuccess } from "@components/toasts/toast";
import { errorToString } from "../../../utils/helpers/error-to-string";

interface JobProps {
  student: Student;
  resumeId: number;
  applied: boolean;
}

export default function JobPage({ student, resumeId, applied }: JobProps) {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    api
      .get<Job>(`/jobs/${id}`)
      .then((response) => {
        setJob(response.data);
      })
      .catch((error) => {
        notifyError(error.response.data.message);
      });
  }, [id]);

  const apply = async () => {
    try {
      await api.post("job-applications/apply", {
        studentId: student.id,
        jobId: job?.id,
        resumeId,
      });
      document.getElementById("modal")?.click();
      setTimeout(() => {
        router.push("/student/applications");
      }, 1000);
      notifySuccess("Candidatura realizada com sucesso!");
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  while (!job) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <div className="w-full p-2">
        <div className="card card-bordered p-3 w-full">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold py-3">
              {job.title} - {job.remote ? "Remoto" : "Presencial"} - Código da
              vaga: {job.id}
            </h2>

            {applied ? (
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

      <ToastContainer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  try {
    const student = await apiClient.get<Student>("/students/profile");
    const jobApplications = await apiClient.get<JobApplication[]>(
      "job-applications/student",
      {
        params: {
          studentId: student.data.id,
        },
      }
    );
    let applied = false;
    if (
      jobApplications.data.some(
        (jobApplication) => jobApplication.job.id === Number(ctx.query.id)
      )
    ) {
      applied = true;
    }

    return {
      props: {
        student: student.data,
        resumeId: student.data.resume.id,
        applied,
      },
    };
  } catch (error: any) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Banknote, Building, GraduationCap, Hash, MapPin } from "lucide-react";

import { getAPIClient } from "../../../services/api/clientApi";
import { api } from "../../../services/api/api";
import { notifyError, notifySuccess } from "../../../components/Toasts/toast";
import { Vacancy } from "../../../utils/types/vacancy";
import { Student } from "../../../utils/types/users/student";
import { Resume } from "../../../utils/types/resume";
import { JobApplication } from "../../../utils/types/job-application";

interface VacancyProps {
  student: Student;
  resumeId: number;
  applied: boolean;
}

export default function VacancyPage({
  student,
  resumeId,
  applied,
}: VacancyProps) {
  const router = useRouter();
  const { id } = router.query;
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);

  useEffect(() => {
    api
      .get<Vacancy>(`/vacancies/${id}`)
      .then((response) => {
        setVacancy(response.data);
      })
      .catch((error) => {
        notifyError(error.response.data.message);
      });
  }, []);

  const apply = async () => {
    try {
      await api.post("job-applications/apply", {
        studentId: student.id,
        vacancyId: vacancy?.id,
        resumeId,
      });
      document.getElementById("modal")?.click();
      setTimeout(() => {
        router.push("/student/applications");
      }, 1000);
      notifySuccess("Candidatura realizada com sucesso!");
    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  };

  while (!vacancy) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <div className="w-full p-2">
        <div className="card card-bordered p-3 w-full">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold py-3">
              {vacancy.title} - {vacancy.remote ? "Remoto" : "Presencial"} -
              Código da vaga: {vacancy.id}
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
                {vacancy.area?.title}
              </h2>
              <h2 className="flex items-center gap-1">
                <Building />
                {vacancy.company?.name}
              </h2>
              <h2 className="flex items-center gap-1">
                <Banknote />{" "}
                {vacancy.salary ? (
                  <span className="font-semibold">R$ {vacancy.salary},00</span>
                ) : (
                  <span>Salário não informado</span>
                )}
              </h2>
              <h2 className="flex items-center gap-1">
                <MapPin /> {vacancy.city?.name}
              </h2>

              <h2 className="flex items-center gap-1">
                <Hash />
                <p>
                  {vacancy.keywords
                    ?.split(", ")
                    .map((keyword: any, index: any) => (
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
              <h2 className="text-xl vacancyDescription">
                Sobre a vaga:
                <div>
                  <div
                    className="text-xl"
                    dangerouslySetInnerHTML={{ __html: vacancy.description }}
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
              href={`/student/resume?vacancy=${vacancy.id}`}
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
    const resume = await apiClient.get<Resume>("/resumes/me", {
      params: {
        studentId: student.data.id,
      },
    });
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
        (jobApplication) => jobApplication.vacancy.id === Number(ctx.query.id)
      )
    ) {
      applied = true;
    }

    return {
      props: {
        student: student.data,
        resumeId: resume.data.id,
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

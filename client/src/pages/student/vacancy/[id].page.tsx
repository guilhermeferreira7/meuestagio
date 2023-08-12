import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getAPIClient } from "../../../services/api/clientApi";
import { api } from "../../../services/api/api";
import { notifyError } from "../../../components/Toasts/toast";
import { ToastContainer } from "react-toastify";
import { Vacancy } from "../../../utils/types/vacancy";

export default function Vacancy() {
  const router = useRouter();
  const { id } = router.query;
  const [vacancy, setVacancy] = useState<any>({});

  useEffect(() => {
    api
      .get(`/vacancies/${id}`)
      .then((response) => {
        setVacancy(response.data);
      })
      .catch((error) => {
        notifyError(error.response.data.message);
      });
  }, []);

  return (
    <>
      <div className="w-full p-2">
        <div className="card card-bordered p-3 w-full">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold py-3">
              {vacancy.title} - {vacancy.remote ? "Remoto" : "Presencial"} -
              Código da vaga: {vacancy.id}
            </h2>

            <button className="btn btn-sm h-12 btn-primary text-sm lg:text-xl m-2 normal-case">
              Quero me candidatar
            </button>
          </div>
          <div className="lg:flex flex-row">
            <div className="lg:w-1/3 text-xl">
              <h2>Área: {vacancy.area?.title}</h2>
              <h2>Empresa: {vacancy.company?.name}</h2>
              <h2>
                Salário:{" "}
                {vacancy.salary ? (
                  <span className="font-semibold">R$ {vacancy.salary},00</span>
                ) : (
                  <span>Não informado</span>
                )}
              </h2>
              <h2>Cidade: {vacancy.city?.name}</h2>

              <h2>
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

      <ToastContainer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  try {
    await apiClient.get("/students/profile");
  } catch (error: any) {
    if (error.response?.status === 401) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
};

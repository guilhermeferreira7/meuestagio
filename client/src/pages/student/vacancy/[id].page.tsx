import { GetServerSideProps } from "next";
import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getAPIClient } from "../../../services/api/clientApi";
import { api } from "../../../services/api/api";
import { notifyError } from "../../../components/Toasts/toast";
import { ToastContainer } from "react-toastify";
import { Vacancy } from "../../../utils/types/vacancy";
import { Banknote, Building, GraduationCap, Hash, MapPin } from "lucide-react";

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

            <label
              htmlFor="modal"
              className="btn btn-sm h-12 btn-primary text-sm lg:text-xl m-2 normal-case"
            >
              Quero me candidatar
            </label>
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
          <div className="modal-action">
            <label htmlFor="modal" className="btn btn-warning">
              Cancelar
            </label>
            <button className="btn btn-info" onClick={() => {}}>
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

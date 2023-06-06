import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getAPIClient } from "../../../services/api/clientApi";
import { api } from "../../../services/api/api";
import { notifyError } from "../../../components/toasts/toast";
import { ToastContainer } from "react-toastify";
import { Vacancy } from "../../../utils/types/vacancies/vacancy";

export default function Vacancy() {
  const router = useRouter();
  const { id } = router.query;
  const [vacancy, setVacancy] = useState<Vacancy>({} as Vacancy);

  useEffect(() => {
    api
      .get(`/vacancies/${id}`)
      .then((response) => {
        console.log(response.data);

        setVacancy(response.data);
      })
      .catch((error) => {
        notifyError(error.response.data.message);
      });
  }, []);

  return (
    <div>
      <h2>{vacancy.title}</h2>
      <h2>{vacancy.description}</h2>
      <h2>{vacancy.company?.name}</h2>
      <h2>{vacancy.area?.title}</h2>

      <ToastContainer />
    </div>
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

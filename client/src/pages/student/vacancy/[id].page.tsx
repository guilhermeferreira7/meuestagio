import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { getAPIClient } from "../../../services/api/clientApi";

export default function Vacancy() {
  const router = useRouter();
  const { id } = router.query;
  return <div>Vaga {id}</div>;
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

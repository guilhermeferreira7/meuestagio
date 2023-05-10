import React from "react";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../../services/api/clientApi";

export default function CreateVacancy() {
  return <div>CreateVacancy</div>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);

  try {
    await apiClient.get("/companies/profile");
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

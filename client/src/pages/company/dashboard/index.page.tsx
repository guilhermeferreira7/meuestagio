import { GetServerSideProps } from "next";
import React from "react";
import { getAPIClient } from "../../../services/api/clientApi";

export default function CompanyDashboard() {
  return <h1>Company Dashboard</h1>;
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

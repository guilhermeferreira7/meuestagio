import { GetServerSideProps } from "next";
import React from "react";

import { Company } from "../../../utils/types/users/company";
import { getAPIClient } from "../../../services/api/clientApi";

export default function CompanyDashboard() {
  return <h1>Company Dashboard</h1>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    await apiClient.get<Company>("/companies/profile");
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

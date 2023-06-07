import { GetServerSideProps } from "next";
import React from "react";

import { getUser } from "../../../services/api/userLogged";
import { Company } from "../../../utils/types/users/company";

export default function CompanyDashboard() {
  return <h1>Company Dashboard</h1>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const company = await getUser<Company>(ctx);
  if (!company) {
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

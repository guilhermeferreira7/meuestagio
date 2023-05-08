import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React from "react";

export default function CompanyDashboard() {
  return <h1>Company Dashboard</h1>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["next.token"]: token } = parseCookies(ctx);

  const tokenDecoded = (jwtDecode(token) as any).role;

  if (!token || tokenDecoded !== "company") {
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

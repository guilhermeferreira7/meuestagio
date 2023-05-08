import React from "react";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getAPIClient } from "../../../services/api/clientApi";

export default function CompanyProfile({ user }: any) {
  return (
    <div>
      <h1>Meus dados</h1>
      <p>Nome: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Cnpj: {user?.cnpj}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
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

  let company = {};

  try {
    company = (await apiClient("/companies/profile")).data;
  } catch (error: any) {
    console.log(error.response?.message?.data);
  }

  return {
    props: {
      user: company,
    },
  };
};

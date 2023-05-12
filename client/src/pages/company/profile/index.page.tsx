import React from "react";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../../services/api/clientApi";
import { Company } from "../../../utils/types/users/company";
import { getUser } from "../../../services/api/userLogged";

export default function CompanyProfile({ company }: { company: Company }) {
  return (
    <div>
      <h1>Meus dados</h1>
      <p>Nome: {company.name}</p>
      <p>Email: {company.email}</p>
      <p>Cnpj: {company.cnpj}</p>
    </div>
  );
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
    props: {
      company,
    },
  };
};

import { GetServerSideProps } from "next";

import { Company } from "@customTypes/users/company";
import { getAPIClient } from "@services/api/clientApi";
import { PROFILE_COMPANY_PATH } from "../../../constants/api-routes";

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
  try {
    const apiClient = getAPIClient(ctx);
    const company = await apiClient.get<Company>(PROFILE_COMPANY_PATH);
    return {
      props: {
        company: company.data,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

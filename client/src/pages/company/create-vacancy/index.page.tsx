import React from "react";
import { GetServerSideProps } from "next";
import { getUser } from "../../../services/api/userLogged";
import { Company } from "../../../utils/types/users/company";

export default function CreateVacancy() {
  return <div>CreateVacancy</div>;
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

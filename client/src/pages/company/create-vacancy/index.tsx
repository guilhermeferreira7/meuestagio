import React from "react";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

export default function CreateVacancy() {
  return <div>CreateVacancy</div>;
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

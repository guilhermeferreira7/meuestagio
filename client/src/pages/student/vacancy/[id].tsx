import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React from "react";

export default function Vacancy() {
  const router = useRouter();
  const { id } = router.query;
  return <div>Vaga {id}</div>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["next.token"]: token } = parseCookies(ctx);

  const tokenDecoded = (jwtDecode(token) as any).role;

  if (!token || tokenDecoded !== "student") {
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

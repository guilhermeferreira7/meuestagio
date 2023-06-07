import { GetServerSideProps } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";
import React from "react";
import { getAPIClient } from "../services/api/clientApi";

export default function Home() {
  return (
    <div>
      <h1 className="my-3 text-xl font-bold text-black">
        Pagina inicial não logado
      </h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const { ["next.token"]: token } = parseCookies(ctx);
  const { ["next.user"]: user } = parseCookies(ctx);

  const userObj = user ? JSON.parse(user) : null;

  if (token && userObj) {
    return {
      redirect: {
        destination: `/${userObj.role}/dashboard`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

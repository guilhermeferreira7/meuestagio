import { GetServerSideProps } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";
import React from "react";

export default function Home() {
  return (
    <>
      <Head>
        <title>meuestagio</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Home Page</h1>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const { ["next.token"]: token } = parseCookies(ctx);
  const { ["next.user"]: user } = parseCookies(ctx) as any;

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

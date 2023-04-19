import { GetServerSideProps } from "next";
import React from "react";
import { parseCookies } from "nookies";

export default function StudentDashboard() {
  return <h1>Student Home Page</h1>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["next.token"]: token } = parseCookies(ctx);

  if (!token) {
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

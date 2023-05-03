import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { parseCookies } from "nookies";

export default function StudentDashboard() {
  return (
    <div>
      <header>
        <h1>Dashboard</h1>
      </header>
    </div>
  );
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

import { GetServerSideProps } from "next";
import React from "react";
import { parseCookies } from "nookies";
import { getAPIClient } from "../../../../services/api/clientApi";

export default function StudentDashboard() {
  return <h1>Student Home Page</h1>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["next.token"]: token } = parseCookies(ctx);

  const api = getAPIClient(ctx);

  try {
    const user = await api.get("/students/profile");
    console.log(user);
  } catch (error) {
    console.log(error);
  }

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

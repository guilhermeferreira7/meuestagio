import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React from "react";

import { getAPIClient } from "@/services/api/clientApi";
import jwtDecode from "jwt-decode";

export default function StudentProfile({ user }: any) {
  return (
    <div className="text-black">
      <h1>Meus dados</h1>
      <p>Nome: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Instituição: {user?.institution?.name}</p>
      <p>Curso: {user?.course?.name}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
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

  let student = {};

  try {
    student = (await apiClient("/students/profile")).data;
  } catch (error: any) {
    console.log(error.response?.message?.data);
  }

  return {
    props: {
      user: student,
    },
  };
};

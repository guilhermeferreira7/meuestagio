import { GetServerSideProps } from "next";
import React from "react";

import { getAPIClient } from "@/services/api/clientApi";

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

  try {
    const result = await apiClient.get("/students/profile");
    const student = result.data;
    return {
      props: {
        user: student,
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

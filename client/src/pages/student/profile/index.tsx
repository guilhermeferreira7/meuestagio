import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React from "react";
import { getAPIClient } from "../../../../services/api/clientApi";

interface StudentProfileProps {
  studentInfo: any;
}

export default function StudentProfile({ studentInfo }: StudentProfileProps) {
  return (
    <div>
      <h1>Meus dados</h1>
      <p>Nome: {studentInfo.name}</p>
      <p>Email: {studentInfo.email}</p>
      <p>Instituição: {studentInfo.institutionId}</p>
      <p>Curso: {studentInfo.courseId}</p>
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

  const api = getAPIClient(ctx);
  const { data } = await api.get("/students/profile");

  return {
    props: {
      studentInfo: data,
    },
  };
};

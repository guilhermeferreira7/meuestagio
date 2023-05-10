import { GetServerSideProps } from "next";
import React from "react";

import { getAPIClient } from "@/services/api/clientApi";
import { Student } from "../../../utils/types/users/student";

export default function StudentProfile({ student }: { student: Student }) {
  return (
    <div className="text-black">
      <h1>Meus dados</h1>
      <p>Nome: {student.name}</p>
      <p>Email: {student.email}</p>
      <p>Instituição: {student.institution?.name}</p>
      <p>Curso: {student.course?.name}</p>
      <p>Telefone: {student.phone}</p>
      <p>Cidade: {student.city?.name}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);

  try {
    const result = await apiClient.get<Student>("/students/profile");
    const student = result.data;
    return {
      props: {
        student,
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

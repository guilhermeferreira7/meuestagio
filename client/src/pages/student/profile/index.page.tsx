import { GetServerSideProps } from "next";
import React from "react";
import Image from "next/image";

import img from "../../../../public/avatar.png";
import { Student } from "../../../utils/types/users/student";
import { getAPIClient } from "../../../services/api/clientApi";

export default function StudentProfile({ student }: { student: Student }) {
  return (
    <div className="w-full text-center">
      <h1 className="font-semibold text-xl">Meus dados</h1>

      <p>Nome: {student.name}</p>
      <p>Email: {student.email}</p>
      <p>Instituição: {student.institution?.name}</p>
      <p>Curso: {student.course?.name}</p>
      <p>Cidade: {student.city?.name}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  try {
    const apiClient = getAPIClient(ctx);
    const student = await apiClient.get<Student>("/students/profile");
    return {
      props: {
        student: student.data,
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

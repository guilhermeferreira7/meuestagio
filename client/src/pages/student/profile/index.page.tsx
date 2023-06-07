import { GetServerSideProps } from "next";
import React from "react";
import Image from "next/image";

import img from "../../../../public/avatar.png";
import { Student } from "../../../utils/types/users/student";
import { getUser } from "../../../services/api/userLogged";

export default function StudentProfile({ student }: { student: Student }) {
  return (
    <div className="w-full text-center">
      <h1 className="font-semibold text-xl">Meus dados</h1>

      <div className="flex flex-col">
        <div className="flex flex-col items-center md:flex-row">
          <div className="w-full md:w-1/2">
            <div className="avatar">
              <div className="rounded bg-base-200">
                <Image src={img} alt="Foto de perfil" width={100} />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex flex-col md:flex-row items-center">
              <p>Nome: </p>
              <p>{student.name}</p>
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <p>Email: </p>
              <p>{student.email}</p>
            </div>
            <div className="flex flex-col gap-1 md:flex-row items-center">
              <p>Telefone: </p>
              <p>
                {student.phone
                  ? student.phone
                  : "Adicione um número de telefone"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p>Instituição: {student.institution?.name}</p>
      <p>Curso: {student.course?.name}</p>
      <p>Cidade: {student.city?.name}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const student = await getUser<Student>(ctx);
  if (!student) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      student,
    },
  };
};

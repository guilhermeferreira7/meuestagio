import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { getAPIClient } from "@/services/api/clientApi";
import { api } from "../../../services/api/api";
import { getStudentProfile } from "../../../services/student/student-service";
import { notification } from "antd";

type StudentInfo = {
  name: string;
  email: string;
  institution: {
    name: string;
  };
  course: {
    name: string;
  };
};

export default function StudentProfile(studentInfo: StudentInfo) {
  const [user, setUser] = useState<StudentInfo>(studentInfo);
  useEffect(() => {
    // api.get("/students/profile").then((response) => {
    //   setUser(response.data);
    // });
    getStudentProfile().then((response) => {
      setUser(response);
    });
  }, []);

  const handleUpdate = async () => {
    const newUser = { ...user, courseId: 2 };
    const updatedUser = await api.patch("/students", {
      ...newUser,
    });

    console.log(updatedUser.data);

    notification["success"]({
      message: "Dados atualizados com sucesso!",
      description: updatedUser.data.course,
    });
  };

  return (
    <div className="text-base-content">
      <h1>Meus dados</h1>
      <p>Nome: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Instituição: {user.institution?.name}</p>
      <p>Curso: {user.course?.name}</p>
      <button className="btn" onClick={handleUpdate}>
        Atualizar
      </button>
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
  let data = {};
  try {
    data = (await api.get("/students/profile")).data;
    console.log(data);
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      studentInfo: data,
    },
  };
};

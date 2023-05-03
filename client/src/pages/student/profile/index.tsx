import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";

import { getAPIClient } from "@/services/api/clientApi";
import { api } from "../../../services/api/api";
import { getStudentProfile } from "../../../services/student/student-service";
import { toast, ToastContainer } from "react-toastify";
import { Loader } from "lucide-react";
import { Alert } from "antd";

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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getStudentProfile().then((response) => {
      setUser(response);
    });
  }, []);

  const notifySuccess = () => {
    toast.success(`Atualizado com sucesso!`, {
      hideProgressBar: true,
      draggable: true,
    });
  };

  const notifyError = (message: string) => {
    toast.error(`Erro: ${message}`, {
      autoClose: 0,
      hideProgressBar: true,
      draggable: true,
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    const newUser = { courseId: 1 };
    try {
      const updatedUser = await api.patch("/students", {
        ...newUser,
      });
      notifySuccess();
    } catch (error: any) {
      notifyError(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-base-content">
      <h1>Meus dados</h1>
      <p>Nome: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Instituição: {user.institution?.name}</p>
      <p>Curso: {user.course?.name}</p>

      {loading ? (
        <button className="btn btn-info btn-disabled">
          Atualizando... <Loader className="animate-spin" size={24} />
        </button>
      ) : (
        <button className="btn" onClick={handleUpdate}>
          Atualizar
        </button>
      )}

      <ToastContainer />
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

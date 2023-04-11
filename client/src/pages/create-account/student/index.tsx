import React, { useState } from "react";
import { Button, Card, Form, Input, Select, notification } from "antd";
import { GetStaticProps } from "next";

import ReCAPTCHA from "react-google-recaptcha";

import { API_BASE_URL } from "../../../../services/constants";

import styles from "./styles.module.css";

import { saveStudent } from "../../../../services/users/student-service";
import axiosApi from "../../../../services/axiosApi";
import axios from "axios";
import { useRouter } from "next/router";

interface CreateUser {
  name: string;
  email: string;
  institutionId: string;
  courseId: string;
  password: string;
}

const onFinishFailed = (errorInfo: any) => {
  console.log(errorInfo);
};

interface Institution {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
}

interface PageProps {
  institutions: Institution[];
}

export default function CreateAccount({ institutions }: PageProps) {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>();

  const [courseSelected, setCourseSelected] = useState();
  const [institutionSelected, setInstitutionSelected] = useState();

  const [courseId, setCourseId] = useState();
  const [institutionId, setInstitutionId] = useState();

  const onFinish = async (values: any) => {
    if (!institutionId) return onFinishFailed("Instituição não selecionada!");
    if (!courseId) return onFinishFailed("Curso não selecionado!");

    const user: CreateUser = {
      name: values.username,
      email: values.email,
      password: values.password,
      institutionId,
      courseId,
    };

    try {
      await saveStudent(user);
      notification["success"]({
        message: "Conta criada com sucesso",
      });
      router.push("/student/homepage");
    } catch (error: any) {
      notification["error"]({
        message: "Algo deu errado!",
        description: `${error.response.data.message}`,
      });
    }
  };

  const changeInstitution = async (value: any) => {
    try {
      const res = await axios.get(`institutions/${value}/courses`, {
        baseURL: API_BASE_URL,
      });
      setCourses(res.data);
    } catch (error) {
      console.log(error);
    }

    setInstitutionSelected(value);
    setInstitutionId(value);
    setCourseSelected(undefined);
    setCourseId(undefined);
  };

  const onCourseChange = (value: any) => {
    setCourseSelected(value);
    setCourseId(value);
  };

  return (
    <Card title="Crie sua conta" className={styles.formCreateAccount}>
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{ accentColor: "darkgreen" }}
      >
        <Form.Item
          label="Nome"
          name="username"
          rules={[
            {
              min: 3,
              required: true,
              type: "string",
              message: "Nome deve ter 3 ou mais caracteres",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="E-Mail"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "E-mail inválido!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Instituição" required>
          <Select
            value={institutionSelected}
            onChange={changeInstitution}
            options={institutions?.map((institution) => ({
              label: institution.name,
              value: institution.id,
            }))}
          />
        </Form.Item>
        <Form.Item label="Curso" required>
          <Select
            value={courseSelected}
            onChange={onCourseChange}
            options={courses?.map((course) => ({
              label: course.name,
              value: course.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, message: "Digite sua senha" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Cadastrar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export const getServerSideProps: GetStaticProps = async () => {
  try {
    const institutions = (await axiosApi.get("/institutions")).data;
    return {
      props: {
        institutions: JSON.parse(JSON.stringify(institutions)),
      },
    };
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      institutions: [],
    },
  };
};

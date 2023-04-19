import { Button, Card, Form, Input, Radio, notification } from "antd";
import React, { useState } from "react";

import styles from "./styles.module.css";
import { saveStudent } from "../../../services/student/student-service";
import { useRouter } from "next/router";

export default function CreateAccount() {
  const router = useRouter();
  const [formType, setFormType] = useState("student");

  const changeFields = (e: any) => {
    setFormType(e.target.value);
  };

  const handleSignUp = async (values: any) => {
    const user = {
      name: values.username,
      email: values.email,
      password: values.password,
    };

    try {
      if (formType === "student") {
        await saveStudent(user);
        notification["success"]({
          message: "Conta criada com sucesso",
        });
        router.push("/students/homepage");
      } else {
        notification["warning"]({
          message: "Aviso!",
          description: "Ainda não é possível criar uma conta de empresa",
        });
      }
    } catch (error: any) {
      notification["error"]({
        message: "Algo deu errado!",
        description: `${error.response.data.message}`,
      });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1>Crie já sua conta para utilizar o sistema!</h1>
      </div>

      <Card title="Cadastre-se" className={styles.formCard}>
        <Form
          layout="vertical"
          name="basic"
          initialValues={{ remember: true, userType: "student" }}
          onFinish={handleSignUp}
          autoComplete="on"
        >
          <Form.Item
            className={styles.formItem}
            label="Criar conta como:"
            name="userType"
            rules={[
              { required: true, message: "Selecione uma opção para cadastro" },
            ]}
          >
            <Radio.Group onChange={changeFields}>
              <Radio.Button value="student">Aluno</Radio.Button>
              <Radio.Button value="company">Empresa</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            className={styles.formItem}
            label={formType === "student" ? "Nome Completo" : "Nome da Empresa"}
            name="username"
            rules={[
              {
                required: true,
                message:
                  formType === "student"
                    ? "Digite seu nome completo"
                    : "Digite o nome da empresa",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className={styles.formItem}
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

          <Form.Item
            className={styles.formItem}
            label="Senha"
            name="password"
            rules={[{ required: true, message: "Digite sua senha" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirme sua senha"
            name="password-repeat"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Por favor confirme sua senha!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("As senhas não são iguais!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item className={styles.buttonLogin}>
            <Button type="primary" htmlType="submit">
              Criar conta
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

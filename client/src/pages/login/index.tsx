import React, { useContext, useState } from "react";
import { Button, Card, Form, Input, Radio, notification } from "antd";

import styles from "./styles.module.css";
import { AuthContext } from "../../contexts/AuthContext";

export default function Login() {
  const { signIn } = useContext(AuthContext);

  const onFinish = async (values: any) => {
    const email = values.email;
    const password = values.password;
    const userType = values.userType;

    try {
      const user = await signIn(email, password, userType);
      notification["success"]({
        message: `Seja bem vindo de volta ${user?.name}`,
      });
    } catch (error: any) {
      notification["error"]({
        message: "Erro",
        description: `${error.response.data.message}`,
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1>
          Seja bem vindo! Faça login ou cadastre-se para acessar a plataforma!
        </h1>
      </div>

      <Card title="Entrar" className={styles.formCard}>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
        >
          <Form.Item
            label="Opções de login"
            name="userType"
            className={styles.loginOptions}
            rules={[
              { required: true, message: "Selecione uma opção para login" },
            ]}
          >
            <Radio.Group>
              <Radio.Button value="student">Aluno</Radio.Button>
              <Radio.Button value="professor">Professor</Radio.Button>
              <Radio.Button value="company">Empresa</Radio.Button>
            </Radio.Group>
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

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: "Digite sua senha" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item className={styles.buttonLogin}>
            <Button type="primary" htmlType="submit">
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

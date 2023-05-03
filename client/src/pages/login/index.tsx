import React, { useContext } from "react";
import { Button, Form, Input, Radio } from "antd";

import Link from "next/link";

import { AuthContext } from "@/contexts/AuthContext";

export default function Login() {
  const { signIn } = useContext(AuthContext);

  const onFinish = async (values: any) => {
    const email = values.email;
    const password = values.password;
    const userType = values.userType;

    try {
      const user = await signIn(email, password, userType);
    } catch (error: any) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 h-full justify-center items-center">
      <header>
        Seja bem vindo! Faça login ou
        <Link href="/create-account" className="text-white font-bold">
          {" "}
          cadastre-se
        </Link>{" "}
        para acessar a plataforma!
      </header>

      <div className="flex">
        <div className="card bg-base-content shadow-xl flex w-96 items-center">
          <h2 className="card-title text-primary">Login</h2>
          <div className="card-body">
            <Form
              name="basic"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="on"
              className="flex flex-col gap-4 items-center justify-center"
            >
              <Form.Item
                className="flex flex-col gap-1"
                label="Opções de login"
                name="userType"
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
                className="flex flex-col gap-1"
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
                className="flex flex-col gap-1"
                label="Senha"
                name="password"
                rules={[{ required: true, message: "Digite sua senha" }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item className="flex flex-col gap-1">
                <Button htmlType="submit">Entrar</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

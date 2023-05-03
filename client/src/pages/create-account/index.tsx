import { Button, Card, Form, Input, Radio } from "antd";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

import { saveStudent } from "@/services/student/student-service";
import { AuthContext } from "../../contexts/AuthContext";

export default function CreateAccount() {
  const { signIn } = useContext(AuthContext);
  const [formType, setFormType] = useState("student");

  const notifySuccess = () => {
    toast.success("Cadastrado com sucesso!", {
      hideProgressBar: true,
      draggable: true,
    });
  };

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
        signIn(values.email, values.password, "student");
        notifySuccess();
      } else {
        console.log("company");
      }
    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  };

  return (
    <div>
      <div>
        <h1>Crie já sua conta para utilizar o sistema!</h1>
      </div>

      <Card title="Cadastre-se">
        <Form
          layout="vertical"
          name="basic"
          initialValues={{ remember: true, userType: "student" }}
          onFinish={handleSignUp}
          autoComplete="on"
        >
          <Form.Item
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

          {formType === "student" ? (
            <Form.Item
              label="Instiuição"
              name="institution"
              rules={[
                {
                  required: true,
                  message: "Digite o nome da sua instituição",
                },
              ]}
            >
              <Input />
            </Form.Item>
          ) : (
            <Form.Item
              label="CNPJ"
              name="cnpj"
              rules={[
                {
                  required: true,
                  message: "Digite o CNPJ da sua empresa",
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item
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

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Criar conta
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

import React, { useContext, useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Role } from "../../utils/types/auth/user-auth";
import { AuthContext } from "../../contexts/AuthContext";
import { loginSchema } from "../../utils/validators/login-schema";
import { Form } from "../../components/Form";

type LoginData = z.infer<typeof loginSchema>;

export default function Login() {
  const { signIn } = useContext(AuthContext);
  const [errorLoginMessage, setErrorLoginMessage] = useState("");

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit } = loginForm;

  const handleLogin = async (data: LoginData) => {
    try {
      await signIn(data.email, data.password, data.userRole);
    } catch (error: any) {
      setErrorLoginMessage(error.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center container w-full text-black">
      <div className="">
        <h2 className="text-lg my-3 text-center">
          Seja bem vindo! Faça login ou
          <Link href="/create-account" className="text-primary font-bold">
            {" "}
            cadastre-se{" "}
          </Link>
          para acessar a plataforma!
        </h2>
      </div>

      <FormProvider {...loginForm}>
        <form
          className="flex flex-col gap-2 w-1/3"
          onSubmit={handleSubmit(handleLogin)}
        >
          <Form.Field>
            <div className="btn-group self-center">
              <Form.InputRadio
                value={Role.Student}
                name="userRole"
                title="Aluno"
                defaultChecked
              />
              <Form.InputRadio
                value={Role.Company}
                name="userRole"
                title="Empresa"
              />
              <Form.InputRadio
                value={Role.Professor}
                name="userRole"
                title="Professor"
              />
              <Form.ErrorMessage field="userRole" />
            </div>
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="email">E-mail</Form.Label>
            <Form.InputText type="email" name="email" />
            <Form.ErrorMessage field="email" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="password">Senha</Form.Label>
            <Form.InputText type="password" name="password" />
            <Form.ErrorMessage field="password" />
          </Form.Field>
          {errorLoginMessage && (
            <div className="flex items-center gap-2 text-error">
              <AlertCircle size={24} />
              <span>{errorLoginMessage}</span>
            </div>
          )}
          <button className="btn btn-primary">Login</button>
        </form>
      </FormProvider>
    </div>
  );
}

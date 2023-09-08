import { useContext, useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthContext } from "@contexts/AuthContext";
import { Role } from "@customTypes/auth/user-auth";
import { loginSchema } from "@utils/validators/login-schema";

import { Form } from "@components/Form";

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
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl my-5 text-center">
        Seja bem vindo! Faça login ou
        <Link href="/create-account" className="text-primary font-bold">
          {" "}
          cadastre-se{" "}
        </Link>
        para acessar a plataforma!
      </h2>

      <FormProvider {...loginForm}>
        <form
          className="flex flex-col gap-2 w-5/6 lg:w-3/5"
          onSubmit={handleSubmit(handleLogin)}
        >
          <Form.Field>
            <div className="btn-group self-center">
              <Form.InputRadio
                value={Role.Student}
                name="userRole"
                id="student"
                title="Aluno"
                defaultChecked
              />
              <Form.InputRadio
                value={Role.Company}
                name="userRole"
                id="company"
                title="Empresa"
              />
              <Form.InputRadio
                value={Role.Professor}
                name="userRole"
                id="professor"
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

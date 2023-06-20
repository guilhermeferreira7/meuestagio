import React, { useContext, useState } from "react";
import { Form } from "../../../components/Form";
import { FormProvider, useForm } from "react-hook-form";
import { AuthContext } from "../../../contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../utils/validators/login-schema";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import { Role } from "../../../utils/types/auth/user-auth";

type LoginData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { signIn } = useContext(AuthContext);
  const [errorLoginMessage, setErrorLoginMessage] = useState("");

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit } = loginForm;

  const handleLogin = async (data: LoginData) => {
    try {
      await signIn(data.email, data.password, Role.Admin);
    } catch (error: any) {
      setErrorLoginMessage(error.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h2 className="text-2xl font-semibold mb-2">
        Acessar como administrador
      </h2>
      <FormProvider {...loginForm}>
        <form
          className="flex flex-col gap-2 w-1/3"
          onSubmit={handleSubmit(handleLogin)}
        >
          <Form.InputRadio
            value={Role.Admin}
            name="userRole"
            id="admin"
            title="Aluno"
            className="hidden"
            defaultChecked
          />
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

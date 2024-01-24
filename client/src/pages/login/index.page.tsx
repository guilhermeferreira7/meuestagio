import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { parseCookies } from "nookies";
import { useContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { AppCard, Form } from "components";
import { AuthContext } from "contexts/AuthContext";
import { LoginSchema } from "schemas";
import { Role, UserAuth } from "types";

export default function Login() {
  const { signIn } = useContext(AuthContext);
  const [errorLoginMessage, setErrorLoginMessage] = useState("");
  const { ["meuestagio.user"]: cookie } = parseCookies();
  const user: UserAuth | undefined = cookie ? JSON.parse(cookie) : null;

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  const { handleSubmit } = loginForm;

  const handleLogin = async (data: LoginSchema) => {
    try {
      await signIn(data.email, data.password, data.userRole, data.rememberMe);
    } catch (error: any) {
      setErrorLoginMessage(error.response?.data?.message);
    }
  };

  return (
    <div className="max-w-[80%]">
      <h2 className="text-2xl my-5 text-center">
        Seja bem vindo! Faça login ou
        <Link href="/create-account" className="text-primary font-bold">
          {" "}
          cadastre-se{" "}
        </Link>
        para acessar a plataforma!
      </h2>
      <AppCard>
        <div className="flex flex-col justify-center items-center">
          <FormProvider {...loginForm}>
            <form
              className="flex flex-col gap-2 w-5/6 lg:w-3/5"
              onSubmit={handleSubmit(handleLogin)}
            >
              <Form.Field>
                <p className="text-center text-lg font-semibold">Sou</p>
                <div className="btn-group self-center">
                  <Form.InputRadio
                    value={Role.Student}
                    name="userRole"
                    id="student"
                    title="Aluno"
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
                </div>
                <div className="text-center">
                  <Form.ErrorMessage field="userRole" />
                </div>
              </Form.Field>
              <Form.Field>
                <Form.Label htmlFor="email">E-mail</Form.Label>
                <Form.InputText
                  type="email"
                  name="email"
                  defaultValue={user?.email}
                />
                <Form.ErrorMessage field="email" />
              </Form.Field>
              <Form.Field>
                <Form.Label htmlFor="password">Senha</Form.Label>
                <Form.InputText type="password" name="password" />
                <Form.ErrorMessage field="password" />
              </Form.Field>
              <Form.Field>
                <Form.InputCheckbox label="Lembrar-me" name="rememberMe" />
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
      </AppCard>
    </div>
  );
}

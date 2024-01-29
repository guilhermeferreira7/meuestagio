import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Form, notify } from "components";
import { AuthContext } from "contexts/AuthContext";
import { LoginSchema } from "schemas";
import { Role } from "types";
import { errorToString } from "utils";

export default function AdminLogin() {
  const { signIn } = useContext(AuthContext);

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  const { handleSubmit } = loginForm;

  const handleLogin = async (data: LoginSchema) => {
    try {
      await signIn(data.email, data.password, Role.Admin);
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-2">
        Acessar como administrador
      </h2>
      <FormProvider {...loginForm}>
        <form
          className="flex flex-col gap-2 w-5/6 lg:w-2/5"
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
          <button className="btn btn-primary">Login</button>
        </form>
      </FormProvider>
    </>
  );
}

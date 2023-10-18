import { useContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactPageOutlined, EditOutlined } from "@mui/icons-material";

import { Form } from "../../../components";
import { notify } from "../../../components/toasts/toast";
import { PROFILE_STUDENT_PATH } from "../../../constants/api-routes";
import { AuthContext } from "../../../contexts/AuthContext";
import { api } from "../../../services/api/api";
import { LoginResponse } from "../../../types/auth/login";
import { errorToString } from "../../../utils/helpers/error-to-string";
import { phoneMask } from "../../../utils/masks/phoneMask";
import {
  ContactData,
  editContactSchema,
} from "../../../utils/validators/edit-profile-schema";

export default function ContactInfoForm({ initialData }: any) {
  const [formDisabled, setFormDisabled] = useState(true);
  const editContactForm = useForm<ContactData>({
    mode: "onTouched",
    resolver: zodResolver(editContactSchema),
    defaultValues: {
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone,
    },
  });

  const { handleSubmit } = editContactForm;

  const { updateUserData } = useContext(AuthContext);

  const editProfile = async (data: ContactData) => {
    if (!Object.values(data).some((v) => v)) {
      return;
    }
    try {
      const { access_token, user } = (
        await api.patch<LoginResponse>(PROFILE_STUDENT_PATH, data)
      ).data;
      notify.success("Contato atualizado com sucesso!");
      updateUserData(user, access_token);
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  const inputPhoneChange = (e: any) => {
    const { value } = e.target;
    editContactForm.setValue("phone", value);
  };

  return (
    <>
      <FormProvider {...editContactForm}>
        <div className="lg:grid grid-cols-2 gap-2">
          <div className="flex justify-between col-span-2">
            <h2 className="text-md font-semibold flex gap-1">
              <ContactPageOutlined />
              <span>Informações de contato</span>
            </h2>
            <div className="flex items-center gap-1">
              {!formDisabled ? (
                <>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => {
                      editContactForm.reset(initialData);
                      setFormDisabled(!formDisabled);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={handleSubmit(editProfile)}
                  >
                    Salvar
                  </button>
                </>
              ) : (
                <button
                  className="flex items-center text-info"
                  onClick={() => {
                    setFormDisabled(!formDisabled);
                  }}
                >
                  <EditOutlined />
                  Editar
                </button>
              )}
            </div>
          </div>
          <Form.Field>
            <Form.Label htmlFor="name">Nome</Form.Label>
            <Form.InputText
              type="text"
              name="name"
              disabled={formDisabled}
              placeholder={initialData.name}
              defaultValue={initialData.name}
            />
            <Form.ErrorMessage field="name" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="email">
              <span>Email</span>
              {initialData.emailVerified ? (
                <span className="text-green-500"> (Verificado)</span>
              ) : (
                <>
                  <span className="text-red-500"> (Não verificado) </span>
                  <button className="underline text-info">
                    Enviar email de verificação
                  </button>
                </>
              )}
            </Form.Label>
            <Form.InputText
              type="email"
              name="email"
              disabled={formDisabled}
              placeholder={initialData.email}
              defaultValue={initialData.email}
            />
            <Form.ErrorMessage field="email" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="phone">
              <span>Telefone</span>
              {initialData.emailVerified ? (
                <span className="text-green-500"> (Verificado)</span>
              ) : (
                <>
                  <span className="text-red-500"> (Não verificado) </span>
                  <button className="underline text-info">
                    Verificar telefone
                  </button>
                </>
              )}
            </Form.Label>
            <Form.InputText
              name="phone"
              disabled={formDisabled}
              placeholder={
                initialData.phone ? initialData.phone + "" : "(00) 00000-0000"
              }
              onChange={inputPhoneChange}
              value={phoneMask(editContactForm.watch("phone") as string)}
            />
            <Form.ErrorMessage field="phone" />
          </Form.Field>
        </div>
      </FormProvider>
    </>
  );
}

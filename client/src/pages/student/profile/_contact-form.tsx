import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, Pencil } from "lucide-react";
import { editContactSchema } from "../../../utils/validators/edit-profile-schema";
import { Form } from "../../../components/Form";

type ContactData = z.infer<typeof editContactSchema>;

export default function ContactInfoForm({ initialData }: any) {
  const [formDisabled, setFormDisabled] = useState(true);
  const editContactForm = useForm<ContactData>({
    resolver: zodResolver(editContactSchema),
  });

  const { handleSubmit } = editContactForm;

  const editProfile = async (data: ContactData) => {
    console.log(data);
  };

  return (
    <>
      <FormProvider {...editContactForm}>
        <div className="lg:grid grid-cols-2 gap-2">
          <div className="flex justify-between col-span-2">
            <h2 className="text-md font-semibold flex gap-1">
              <Contact />
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
                  className="btn btn-sm btn-primary gap-1"
                  onClick={() => {
                    setFormDisabled(!formDisabled);
                  }}
                >
                  <Pencil size={18} />
                  <span>Editar</span>
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
              type="text"
              name="phone"
              disabled={formDisabled}
              placeholder={
                initialData.phone ? initialData.phone + "" : "(00) 00000-0000"
              }
            />
            <Form.ErrorMessage field="phone" />
          </Form.Field>
        </div>
      </FormProvider>
    </>
  );
}

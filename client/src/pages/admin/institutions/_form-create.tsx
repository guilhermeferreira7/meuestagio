import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { City } from "@customTypes/city";
import { Institution } from "@customTypes/institution";
import { api } from "@services/api/api";
import { createInstitutionFormSchema } from "@utils/validators/institution-schema";

import { Form } from "@components/Form";
import { notify } from "@components/toasts/toast";

type InstitutionForm = z.infer<typeof createInstitutionFormSchema>;

interface CreateInstitutionFormProps {
  cities: City[];
}

export default function CreateInstitutionForm({
  cities,
}: CreateInstitutionFormProps) {
  const createInstitutionForm = useForm<InstitutionForm>({
    mode: "onTouched",
    resolver: zodResolver(createInstitutionFormSchema),
  });
  const { handleSubmit } = createInstitutionForm;
  const router = useRouter();

  const handleSaveInstitution = async (data: InstitutionForm) => {
    if (!data.institutionName) {
      notify.warning("O nome da instituição não pode ser vazio!");
      return;
    } else if (!data.cityId) {
      notify.warning("A cidade não pode ser vazia!");
      return;
    }

    if (
      !confirm(
        `Deseja cadastrar a instituição ${data.institutionName}? O nome da instituição não poderá ser alterado!`
      )
    ) {
      return;
    }

    try {
      await api.post<Institution>("/institutions", {
        name: data.institutionName,
        cityId: data.cityId,
      });

      notify.success(
        `Instituição ${data.institutionName} cadastrado com sucesso!`
      );
      router.reload();
    } catch (error: any) {
      notify.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <FormProvider {...createInstitutionForm}>
        <form
          className="flex flex-col gap-1"
          onSubmit={handleSubmit(handleSaveInstitution)}
        >
          <Form.Field>
            <Form.Label htmlFor="institutionName">
              Nome da instituição
            </Form.Label>
            <Form.InputText
              name="institutionName"
              placeholder="Digite um nome..."
            />
            <Form.ErrorMessage field="institutionName" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="cityId">Cidade</Form.Label>
            <Form.InputSelect name="cityId">
              <option value="" disabled>
                Escolha uma cidade
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} - {city.state}
                </option>
              ))}
            </Form.InputSelect>
            <Form.ErrorMessage field="cityId" />
          </Form.Field>

          <button
            type="submit"
            className="btn btn-primary w-1/2 self-center mt-2"
          >
            Cadastrar
          </button>
        </form>
      </FormProvider>
    </>
  );
}

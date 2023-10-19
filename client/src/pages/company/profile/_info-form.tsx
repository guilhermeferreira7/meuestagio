import {
  CancelOutlined,
  Clear,
  ContactPageOutlined,
  Edit,
} from "@mui/icons-material";
import React, { ChangeEvent, useContext, useState } from "react";
import {
  UpdateCompanyData,
  updateCompanySchema,
} from "../../../utils/validators/company-schema";
import { Company } from "../../../types/users/company";
import { City } from "../../../types/city";
import { api } from "../../../services/api/api";
import { AuthContext } from "../../../contexts/AuthContext";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CITIES_PATH,
  PROFILE_COMPANY_PATH,
} from "../../../constants/api-routes";
import { errorToString } from "../../../utils/helpers/error-to-string";
import { notify } from "../../../components/toasts/toast";
import { Form } from "../../../components";
import { phoneMask } from "../../../utils/masks/phoneMask";

type InfoFormProps = {
  company: Company;
  setCompany: React.Dispatch<React.SetStateAction<Company>>;
  states: string[];
  initialCities: City[];
};

export default function InfoForm({
  company,
  setCompany,
  states,
  initialCities,
}: InfoFormProps) {
  const [cities, setCities] = useState<City[]>(initialCities);
  const { updateUserData } = useContext(AuthContext);
  const [formDisabled, setFormDisabled] = useState(true);

  const updateCompanyForm = useForm<UpdateCompanyData>({
    resolver: zodResolver(updateCompanySchema),
    mode: "all",
    defaultValues: {
      name: company.name,
      email: company.email,
      phone: company.phone,
      cityId: company.city.id + "",
    },
  });

  const { handleSubmit } = updateCompanyForm;

  const inputPhoneChange = (e: any) => {
    const { value } = e.target;
    updateCompanyForm.setValue("phone", value);
  };

  const toggleFormDisabled = () => {
    updateCompanyForm.reset({
      name: company.name,
      email: company.email,
      phone: company.phone,
      cityId: company.city.id + "",
    });
    setFormDisabled(!formDisabled);
  };

  const updateCompany = async (data: UpdateCompanyData) => {
    try {
      const response = await api.patch(PROFILE_COMPANY_PATH, {
        name: data.name ? data.name : company.name,
        email: data.email ? data.email : company.email,
        phone: data.phone ? data.phone : company.phone,
        cityId: data.cityId ? data.cityId : company.city.id,
      });
      notify.success("Dados atualizados com sucesso!");
      updateUserData(response.data.user, response.data.access_token);
      setCompany(response.data.company);
      setFormDisabled(!formDisabled);
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  const updateCities = async (e: ChangeEvent<HTMLSelectElement>) => {
    const response = await api.get<City[]>(CITIES_PATH, {
      params: { state: e.target.value },
    });
    setCities(response.data);
  };
  return (
    <>
      <p className="text-xl font-semibold flex justify-between">
        <span className="flex items-center gap-1 ">
          <ContactPageOutlined /> Dados da empresa
        </span>
        {formDisabled ? (
          <button className="text-info text-lg" onClick={toggleFormDisabled}>
            Editar <Edit />
          </button>
        ) : (
          <button className="text-error text-lg" onClick={toggleFormDisabled}>
            Cancelar <Clear />
          </button>
        )}
      </p>
      <FormProvider {...updateCompanyForm}>
        <form onSubmit={handleSubmit(updateCompany)}>
          <Form.Field>
            <Form.Label htmlFor="name">Nome</Form.Label>
            <Form.InputText name="name" disabled={formDisabled} />
            <Form.ErrorMessage field="name" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.InputText name="email" disabled={formDisabled} />
            <Form.ErrorMessage field="email" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="phone">Telefone</Form.Label>
            <Form.InputText
              name="phone"
              disabled={formDisabled}
              onChange={inputPhoneChange}
              value={phoneMask(updateCompanyForm.watch("phone") as string)}
            />
            <Form.ErrorMessage field="phone" />
          </Form.Field>
          <div className="grid grid-cols-2 gap-1">
            <div className="flex flex-col gap-1">
              <p className="font-bold">Estado</p>
              <select
                className="select select-primary w-full"
                onChange={updateCities}
                disabled={formDisabled}
              >
                <option disabled value="">
                  Selecione um estado
                </option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <Form.Field>
              <Form.Label htmlFor="cityId">Cidade</Form.Label>
              <Form.InputSelect
                name="cityId"
                defaultValue={company.city.id}
                disabled={formDisabled}
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </Form.InputSelect>
              <Form.ErrorMessage field="cityId" />
            </Form.Field>
          </div>
          <button
            disabled={formDisabled}
            className="btn btn-primary w-full mt-2"
          >
            Atualizar
          </button>
        </form>
      </FormProvider>
    </>
  );
}

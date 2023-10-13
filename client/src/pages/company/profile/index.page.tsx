import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ChangeEvent, useContext, useState } from "react";

import { Form } from "../../../components";
import { notify } from "../../../components/toasts/toast";
import {
  CITIES_PATH,
  PROFILE_COMPANY_PATH,
} from "../../../constants/api-routes";
import { AuthContext } from "../../../contexts/AuthContext";
import { api } from "../../../services/api/api";
import withCompanyAuth from "../../../services/auth/withCompanyAuth";
import { City } from "../../../types/city";
import { Company } from "../../../types/users/company";
import { errorToString } from "../../../utils/helpers/error-to-string";
import { phoneMask } from "../../../utils/masks/phoneMask";
import {
  UpdateCompanyData,
  updateCompanySchema,
} from "../../../utils/validators/company-schema";

type CompanyProfileProps = {
  company: Company;
  states: string[];
  initialCities: City[];
};

export default function CompanyProfile({
  company,
  states,
  initialCities,
}: CompanyProfileProps) {
  const [formDisabled, setFormDisabled] = useState(true);
  const [companyUpdated, setCompany] = useState<Company>(company);
  const [cities, setCities] = useState<City[]>(initialCities);

  const { updateUserData } = useContext(AuthContext);

  const updateCompanyForm = useForm<UpdateCompanyData>({
    resolver: zodResolver(updateCompanySchema),
    mode: "all",
    defaultValues: {
      name: companyUpdated.name,
      email: companyUpdated.email,
      phone: companyUpdated.phone,
      cityId: companyUpdated.city.id + "",
    },
  });

  const { handleSubmit } = updateCompanyForm;

  const inputPhoneChange = (e: any) => {
    const { value } = e.target;
    updateCompanyForm.setValue("phone", value);
  };

  const updateCompany = async (data: UpdateCompanyData) => {
    try {
      const response = await api.patch(PROFILE_COMPANY_PATH, {
        name: data.name ? data.name : companyUpdated.name,
        email: data.email ? data.email : companyUpdated.email,
        phone: data.phone ? data.phone : companyUpdated.phone,
        cityId: data.cityId ? data.cityId : companyUpdated.city.id,
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
      <div className="w-11/12">
        <h2 className="text-xl font-semibold flex justify-between">
          <span>Dados da empresa</span>
          {formDisabled ? (
            <button
              className="btn btn-primary"
              onClick={() => setFormDisabled(!formDisabled)}
            >
              Editar
            </button>
          ) : (
            <button
              className="btn btn-error"
              onClick={() => {
                updateCompanyForm.reset({
                  name: companyUpdated.name,
                  email: companyUpdated.email,
                  phone: companyUpdated.phone,
                  cityId: companyUpdated.city.id + "",
                });
                setFormDisabled(!formDisabled);
              }}
            >
              Cancelar
            </button>
          )}
        </h2>
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
                  defaultValue={companyUpdated.city.id}
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
      </div>
    </>
  );
}

export const getServerSideProps = withCompanyAuth(
  async (_context, company, getApiClient) => {
    const cities = await getApiClient.get(CITIES_PATH);
    const states = new Set<string>(cities.data.map((city: any) => city.state));
    console.log(states);
    const initialCities = cities.data.filter(
      (city: City) => city.state === company.city.state
    );

    return {
      props: {
        company,
        states: Array.from(states),
        initialCities,
      },
    };
  }
);

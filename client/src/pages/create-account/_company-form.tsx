import { useState } from "react";

import { Form } from "../../components";
import { cnpjMask } from "../../utils/masks/cnpjMask";
import { City } from "../../types/city";

interface CreateCompanyFormProps {
  cities: City[];
}

export default function CreateCompanyForm({ cities }: CreateCompanyFormProps) {
  const [values, setValues] = useState({ cnpj: "" });

  const inputChange = (e: any) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-info italic">
        Qual é sua empresa?
      </h2>
      <Form.Field>
        <Form.Label htmlFor="name">Digite o nome de sua empresa</Form.Label>
        <Form.InputText name="name" />
        <Form.ErrorMessage field="name" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="cnpj">Digite o CNPJ da empresa</Form.Label>
        <Form.InputText
          value={cnpjMask(values.cnpj)}
          onChange={inputChange}
          name="cnpj"
        />
        <Form.ErrorMessage field="cnpj" />
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="cityId">Cidade</Form.Label>
        <Form.InputSelect name="cityId">
          <option disabled value="">
            Qual cidade a empresa está localizada?
          </option>
          {cities.map((city) => {
            return (
              <option key={city.id} value={city.id}>
                {city.name} - {city.state}
              </option>
            );
          })}
        </Form.InputSelect>
        <Form.ErrorMessage field="cityId" />
      </Form.Field>
    </div>
  );
}

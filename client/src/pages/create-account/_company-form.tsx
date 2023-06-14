import React, { useState } from "react";
import { Form } from "../../components/Form";
import { City } from "../../utils/types/city";

interface CreateCompanyFormProps {
  cities: City[];
}

export default function CreateCompanyForm({ cities }: CreateCompanyFormProps) {
  return (
    <div>
      <h2>Qual é sua empresa?</h2>
      <Form.Field>
        <Form.Label htmlFor="name">Digite o nome de sua empresa</Form.Label>
        <Form.InputText name="name" />
        <Form.ErrorMessage field="name" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="cnpj">Digite o CNPJ da empresa</Form.Label>
        <Form.InputText name="cnpj" />
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
                {city.name}
              </option>
            );
          })}
        </Form.InputSelect>
        <Form.ErrorMessage field="cityId" />
      </Form.Field>
    </div>
  );
}
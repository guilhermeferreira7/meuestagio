import React, { useEffect, useState } from "react";
import { Form } from "../../../../components/Form";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { editAddressSchema } from "../../../../utils/validators/edit-profile-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Map, Pencil } from "lucide-react";
import { api } from "../../../../services/api/api";
import { City } from "../../../../utils/types/city";

type AddressData = z.infer<typeof editAddressSchema>;

export default function AddressForm({ initialData, cities }: any) {
  const [formDisabled, setFormDisabled] = useState(true);
  const [states, setStates] = useState<string[]>([]);

  const [citiesFiltered, setCitiesFiltered] = useState<City[]>([]);

  const editAddressForm = useForm<AddressData>({
    resolver: zodResolver(editAddressSchema),
  });

  const { handleSubmit } = editAddressForm;

  useEffect(() => {
    const states: any = [];
    cities.forEach((city: any) => {
      if (!states.includes(city.state)) {
        states.push(city.state);
      }
      setStates(states);
    });
  }, []);

  const editProfile = async (data: AddressData) => {
    console.log(data);
  };

  const setCities = async (e: any) => {
    const response = await api.get<City[]>("/cities", {
      params: { state: e.target.value },
    });
    setCitiesFiltered(response.data);
  };

  return (
    <>
      <FormProvider {...editAddressForm}>
        <div className="lg:grid grid-cols-2 gap-2">
          <div className="flex justify-between col-span-2">
            <h2 className="text-md font-semibold flex gap-1">
              <Map />
              <span>Endereço</span>
            </h2>
            <div className="flex items-center gap-1">
              {!formDisabled ? (
                <>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => {
                      editAddressForm.reset({
                        ...initialData,
                      });
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
            <Form.Label htmlFor="state">Estado</Form.Label>
            <Form.InputSelect
              name="state"
              disabled={formDisabled}
              defaultValue={initialData.state}
              onChange={setCities}
            >
              {states.map((state: any) => (
                <option value={state}>{state}</option>
              ))}
            </Form.InputSelect>
            <Form.ErrorMessage field="state" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="city">Cidade</Form.Label>
            <Form.InputSelect
              name="city"
              disabled={formDisabled}
              defaultValue={initialData.city}
            >
              <option value={initialData.city}>{initialData.city}</option>

              {citiesFiltered.map((city: any) => (
                <option value={city.name}>{city.name}</option>
              ))}
            </Form.InputSelect>
            <Form.ErrorMessage field="city" />
          </Form.Field>
        </div>
      </FormProvider>
    </>
  );
}

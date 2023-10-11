import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Map, Pencil } from "lucide-react";

import { notify } from "../../../components/toasts/toast";
import { Form } from "../../../components";
import {
  CITIES_PATH,
  PROFILE_STUDENT_PATH,
} from "../../../constants/api-routes";
import { api } from "../../../services/api/api";
import { City } from "../../../types/city";
import {
  AddressData,
  editAddressSchema,
} from "../../../utils/validators/edit-profile-schema";
import { errorToString } from "../../../utils/helpers/error-to-string";

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
  }, [cities]);

  const editProfile = async (data: AddressData) => {
    try {
      await api.patch(PROFILE_STUDENT_PATH, {
        cityId: data.city,
      });
      notify.success("Endereço atualizado com sucesso!");
      setFormDisabled(!formDisabled);
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  const setCities = async (e: any) => {
    const response = await api.get<City[]>(CITIES_PATH, {
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
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Form.InputSelect>
            <Form.ErrorMessage field="state" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="city">Cidade</Form.Label>
            <Form.InputSelect
              name="city"
              disabled={formDisabled}
              defaultValue={initialData.city.id}
            >
              <option disabled value={initialData.city.id}>
                {initialData.city.name}
              </option>

              {citiesFiltered.map((city: City) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </Form.InputSelect>
            <Form.ErrorMessage field="city" />
          </Form.Field>
        </div>
      </FormProvider>
    </>
  );
}

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditOutlined, MapOutlined } from "@mui/icons-material";

import { notify } from "../../../components/toasts/toast";
import { Form } from "../../../components";
import {
  CITIES_PATH,
  PROFILE_STUDENT_PATH,
} from "../../../constants/api-routes";
import { api } from "../../../services/api/api";
import { City } from "../../../types/city";
import { Student } from "../../../types/users/student";
import {
  AddressData,
  editAddressSchema,
} from "../../../utils/validators/edit-profile-schema";
import { errorToString } from "../../../utils/helpers/error-to-string";

type AddressFormProps = {
  student: Student;
  cities: City[];
};

export default function AddressForm({ student, cities }: AddressFormProps) {
  const [formDisabled, setFormDisabled] = useState(true);
  const [states, setStates] = useState<string[]>([]);

  const [citiesFiltered, setCitiesFiltered] = useState<City[]>(cities);

  const editAddressForm = useForm<AddressData>({
    resolver: zodResolver(editAddressSchema),
    defaultValues: {
      city: student.city.name,
      state: student.city.state,
    },
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
      const response = await api.patch(PROFILE_STUDENT_PATH, {
        cityId: data.city,
      });
      notify.success("Endereço atualizado com sucesso!");
      resetForm(
        response.data.student.city.name,
        response.data.student.city.state
      );
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

  const resetForm = (city?: string, state?: string) => {
    editAddressForm.reset({
      city: city ? city : student.city.name,
      state: state ? state : student.city.state,
    });
    setCitiesFiltered(cities);
    setFormDisabled(true);
  };

  return (
    <>
      <FormProvider {...editAddressForm}>
        <div className="lg:grid grid-cols-2 gap-2">
          <div className="flex justify-between col-span-2">
            <h2 className="text-xl font-semibold flex gap-1">
              <MapOutlined />
              <span>Endereço</span>
            </h2>
            <div className="flex items-center gap-1">
              {!formDisabled ? (
                <>
                  <button className="text-error" onClick={() => resetForm()}>
                    Cancelar
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleSubmit(editProfile)}
                  >
                    Salvar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setFormDisabled(!formDisabled);
                  }}
                  className="flex items-center text-info"
                >
                  <EditOutlined />
                  Editar
                </button>
              )}
            </div>
          </div>
          <Form.Field>
            <Form.Label htmlFor="state">Estado</Form.Label>
            {formDisabled ? (
              <Form.InputText name="state" disabled />
            ) : (
              <Form.InputSelect
                name="state"
                disabled={formDisabled}
                onChange={setCities}
              >
                {states.map((state: any) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Form.InputSelect>
            )}

            <Form.ErrorMessage field="state" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="city">Cidade</Form.Label>
            {formDisabled ? (
              <Form.InputText name="city" disabled />
            ) : (
              <Form.InputSelect name="city" disabled={formDisabled}>
                {citiesFiltered.map((city: City) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </Form.InputSelect>
            )}

            <Form.ErrorMessage field="city" />
          </Form.Field>
        </div>
      </FormProvider>
    </>
  );
}

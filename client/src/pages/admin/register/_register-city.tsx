import React, { useState } from "react";
import ibgeApi from "../../../services/api/ibgeApi";

interface RegisterCityProps {
  states: any;
}

export default function RegisterCity({ states }: RegisterCityProps) {
  const [cities, setCities] = useState<any>([]);
  const [microregion, setMicroregion] = useState<any>([]);
  const [regionalCities, setRegionalCities] = useState<any>([]);

  async function getCities(stateId: string) {
    const cities = await ibgeApi.get(`/estados/${stateId}/municipios`);
    setCities([...cities.data]);
    setMicroregion([cities.data[0].microrregiao.id]);
  }

  async function showCities() {
    try {
      const getRegionalCities = await ibgeApi.get(
        `/microrregioes/${microregion}/municipios`
      );
      setRegionalCities([...getRegionalCities.data]);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRegister() {}

  return (
    <div tabIndex={0} className="collapse collapse-plus border w-1/2">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium bg-base-200">
        Cadastrar nova cidade
      </div>
      <div className="collapse-content w-full">
        <div className="flex gap-1 justify-center">
          <div className="flex flex-col gap-1">
            <div className="flex flex-col">
              <label htmlFor="states">Estado:</label>
              <select
                name="states"
                id="states"
                className="select select-primary"
                onChange={(e) => {
                  getCities(e.target.value);
                }}
              >
                {states.map((state: any) => (
                  <option key={state.id} value={state.id}>
                    {state.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="cities">Cidade:</label>
              <select
                name="cities"
                id="cities"
                className="select select-primary"
                onChange={(e) => {
                  setMicroregion([e.target.value]);
                }}
              >
                {cities?.map((city: any) => (
                  <option key={city.id} value={city.microrregiao.id}>
                    {city.nome}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" onClick={showCities}>
              Adicionar
            </button>
            {regionalCities.length > 0 &&
              regionalCities.map((city: any) => (
                <div key={city.id}>{city.nome}</div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import axios from "axios";
import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../../services/api/clientApi";
import { User } from "../../../utils/types/users/user";

interface AdminRegisterProps {
  states: any;
}

export default function AdminRegister({ states }: AdminRegisterProps) {
  const [cities, setCities] = useState<any>([]);
  const [citySelected, setCitySelected] = useState<any>([]);
  const [regionalCities, setRegionalCities] = useState<any>([]);

  const ibgeurlbase = "https://servicodados.ibge.gov.br/api/v1/localidades";

  async function getCities(stateId: string) {
    const cities = await axios.get(
      `${ibgeurlbase}/estados/${stateId}/municipios`
    );
    setCities([...cities.data]);
    setCitySelected([cities.data[0].id]);
  }

  async function registerCities() {
    try {
      const city = await axios.get(`${ibgeurlbase}/municipios/${citySelected}`);
      const getRegionalCities = await axios.get(
        `${ibgeurlbase}/microrregioes/${city.data.microrregiao.id}/municipios`
      );
      setRegionalCities([...getRegionalCities.data]);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="my-5 w-full">
      <div className="flex flex-col items-center justify-center w-full">
        <div tabIndex={0} className="collapse collapse-plus border w-1/2">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
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
                      setCitySelected([e.target.value]);
                    }}
                  >
                    {cities?.map((city: any) => (
                      <option key={city.id} value={city.id}>
                        {city.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="btn btn-primary" onClick={registerCities}>
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
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    const states = await axios.get(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
      { params: { orderBy: "nome" } }
    );
    await apiClient.get<User>("/admin/profile");
    return {
      props: {
        states: states.data,
      },
    };
  } catch (error: any) {
    if (error.response.status === 401) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
};

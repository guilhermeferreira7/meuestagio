import React, { useState } from "react";
import { GetServerSideProps } from "next";

import ibgeApi from "../../../services/api/ibgeApi";
import { getAPIClient } from "../../../services/api/clientApi";
import { api } from "../../../services/api/api";
import {
  CITIES_PATH,
  PROFILE_ADMIN_PATH,
  REGIONS_PATH,
} from "../../../constants/api-routes";
import { User } from "../../../types/users/user";
import { notify } from "../../../components/toasts/toast";
import { errorToString } from "../../../utils/helpers/error-to-string";

interface RegisterCityProps {
  states: any;
}

export default function RegisterCity({ states }: RegisterCityProps) {
  const [cities, setCities] = useState<any>([]);
  const [microregion, setMicroregion] = useState("");
  const [regionName, setRegionName] = useState<any>([]);
  const [regionalCities, setRegionalCities] = useState<any>([]);

  async function getCities(stateId: string) {
    const cities = await ibgeApi.get(`/estados/${stateId}/municipios`);
    setCities([...cities.data]);
    setMicroregion(cities.data[0].microrregiao.id);
  }

  async function showCities() {
    try {
      const getRegionalCities = await ibgeApi.get(
        `/microrregioes/${microregion}/municipios`
      );
      setRegionName(getRegionalCities.data[0].microrregiao.nome);
      setRegionalCities([...getRegionalCities.data]);
    } catch (error) {
      notify.error(errorToString(error));
    }
  }

  async function handleRegister() {
    const regionId = microregion;
    const regionName = regionalCities[0].microrregiao.nome;

    api
      .post(REGIONS_PATH, {
        name: regionName,
        IBGECode: regionId,
        state: regionalCities[0].microrregiao.mesorregiao.UF.nome,
      })
      .then((response) => {
        regionalCities.map(async (city: any) => {
          await api.post(CITIES_PATH, {
            name: city.nome,
            state: city.microrregiao.mesorregiao.UF.nome,
            IBGECityCode: city.id,
            regionId: response.data.id,
            regionName,
          });
        });
        notify.success("Cidades cadastradas com sucesso!");
      })
      .catch((error) => {
        notify.error(
          "Erro ao cadastrar cidades! " + error.response?.data?.message
        );
      });

    document.getElementById("modal")?.click();
  }

  return (
    <div className="flex flex-col w-full ml-5 items-center">
      <h2 className="text-xl font-semibold">Cadastre cidades de uma região</h2>
      <div className="flex gap-1 w-full justify-center">
        <div className="flex flex-col gap-1 w-3/5 items-center">
          <div className="flex flex-col w-full">
            <label htmlFor="states">Estado:</label>
            <select
              name="states"
              id="states"
              className="select select-primary"
              onChange={(e) => {
                getCities(e.target.value);
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Escolha o estado
              </option>
              {states.map((state: any) => (
                <option key={state.id} value={state.id}>
                  {state.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="cities">Cidade:</label>
            <select
              name="cities"
              id="cities"
              className="select select-primary"
              onChange={(e) => {
                setMicroregion(e.target.value);
              }}
            >
              {cities?.map((city: any) => (
                <option key={city.id} value={city.microrregiao.id}>
                  {city.nome}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary w-full" onClick={showCities}>
            Ver cidades da região
          </button>
          {regionalCities.length > 0 && (
            <div className="flex flex-col w-full">
              <div>
                Região de <span className="font-semibold">{regionName},</span>{" "}
                {regionalCities.length} cidades:
              </div>
              <div>
                {regionalCities
                  ?.map((city: any) => city.nome + ", ")
                  .join("")
                  .replace(/,\s*$/, "")}
              </div>
              <label htmlFor="modal" className="btn btn-info self-center w-2/5">
                Adicionar região
              </label>
            </div>
          )}
        </div>

        <input type="checkbox" id="modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="text-lg">
              Adicionar região de{" "}
              <span className="font-bold">{regionName}</span>?
            </h3>
            <div className="modal-action">
              <label htmlFor="modal" className="btn btn-warning">
                Cancelar
              </label>
              <button className="btn btn-info" onClick={handleRegister}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  try {
    await apiClient.get<User>(PROFILE_ADMIN_PATH);

    const states = await ibgeApi.get("/estados", {
      params: { orderBy: "nome" },
    });

    return {
      props: {
        states: states.data,
      },
    };
  } catch (error: any) {
    console.log(errorToString(error));
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

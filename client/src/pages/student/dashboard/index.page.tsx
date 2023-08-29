import { GetServerSideProps } from "next";
import React, { useState } from "react";

import { getAPIClient } from "../../../services/api/clientApi";
import { Student } from "../../../utils/types/users/student";
import { Vacancy } from "../../../utils/types/vacancy";
import { City } from "../../../utils/types/city";
import { api } from "../../../services/api/api";
import { VACANCIES_STUDENT_LIMIT } from "../../../constants/request";
import CardVacancy from "./_card-vacancy";

interface StudentPageProps {
  vacanciesData: Vacancy[];
  student: Student;
  states: string[];
  initialCities: City[];
}

export default function StudentVacancies({
  vacanciesData,
  student,
  states,
  initialCities,
}: StudentPageProps) {
  const [state, setState] = useState<string>(student.city.state);
  const [cityName, setCityName] = useState<string>(student.city.name);
  const [filters, setFilters] = useState<any>({ city: student.city.id + "" });

  const [cities, setCities] = useState<City[]>(initialCities);
  const [vacancies, setVacancies] = useState<Vacancy[]>(vacanciesData);

  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentSearch, setCurrentSearch] = useState<string>("");

  const [hasMoreVacancies, setHasMoreVacancies] = useState<boolean>(true);

  function cleanFilters() {
    updateFilters({});
    setFilters({});
    setCityName("");
    setState("");
    setCities([]);
    setSearchTerm("");
  }

  async function search(searchTerm: string) {
    setCurrentSearch(searchTerm);
    try {
      const vacancies = await api.get<Vacancy[]>("/vacancies", {
        params: {
          search: searchTerm,
          remote: isRemote,
        },
      });
      setVacancies(vacancies.data);
      setFilters({ search: searchTerm });
    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  }

  async function onStateChange(state: string) {
    if (state) {
      updateFilters({ state });
      const cities = await api.get<City[]>("/cities", {
        params: {
          state,
        },
      });
      setState(state);
      setCities(cities.data);
      setFilters({ state });
    } else {
      updateFilters({});
      setFilters({});
      setCities([]);
      setState("");
    }
  }

  async function onCityChange(city: string) {
    if (city) {
      setFilters({ city: JSON.parse(city).id });
      setCityName(JSON.parse(city).name);
      updateFilters({ city: JSON.parse(city).id });
    } else {
      setFilters({ state });
      updateFilters({ state });
    }
  }

  async function updateFilters(filter: any) {
    try {
      const vacancies = await api.get<Vacancy[]>("/vacancies", {
        params: {
          ...filter,
        },
      });
      setVacancies(vacancies.data);
    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  }

  const moreVacancies = async () => {
    try {
      const response = await api.get("/vacancies", {
        params: {
          page: vacancies.length,
          limit: VACANCIES_STUDENT_LIMIT,
          ...filters,
        },
      });
      setHasMoreVacancies(response.data.length > 0);
      setVacancies([...vacancies, ...response.data]);
    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  };

  return (
    <>
      <h2 className="w-11/12 text-lg flex flex-col items-center">
        {filters.city
          ? `Vagas em ${cityName} (cidade)`
          : filters.state
          ? `Vagas em ${filters.state} (estado)`
          : "Vagas em todo o Brasil"}
      </h2>

      <div className="w-11/12 collapse text-center">
        <input type="checkbox" />

        <div className="collapse-title underline text-primary font-bold p-2">
          Alterar localização
        </div>
        <div className="collapse-content flex gap-1">
          <select
            className="select select-primary w-1/2"
            defaultValue={student.city.state}
            onChange={(e) => onStateChange(e.target.value)}
          >
            <option value="">Qualquer estado</option>
            {states?.map((state: string) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select
            className="select select-primary w-1/2"
            defaultValue={JSON.stringify(student.city)}
            onChange={(e) => onCityChange(e.target.value)}
          >
            <option value="">Qualquer cidade</option>
            {cities?.map((city: City) => (
              <option key={city.id} value={JSON.stringify(city)}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="text-error underline font-semibold"
        onClick={cleanFilters}
      >
        Remover filtros
      </button>

      <div className="w-11/12 flex items-center justify-center my-4">
        <form
          className="w-full lg:w-2/3 flex flex-col items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            search(searchTerm);
          }}
        >
          <div className="flex gap-1 w-full">
            <input
              id="search"
              type="text"
              placeholder="Pesquisar vagas"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-2 input input-primary"
            />
            <button className="btn btn-primary ">Buscar</button>
          </div>
          <div className="w-full flex justify-end items-center gap-1">
            <label htmlFor="remote" className="text-center">
              Mostrar vagas remotas?
            </label>
            <input
              type="checkbox"
              id="remote"
              className="checkbox checkbox-primary"
              onChange={(e) => setIsRemote(e.target.checked)}
            />
          </div>
        </form>
      </div>

      <div className="w-11/12 flex flex-col gap-2 mx-8 mb-4">
        {currentSearch && <p className="text-xl">Busca: {currentSearch}</p>}
        {vacancies.length > 0 ? (
          vacancies.map((vacancy: Vacancy) => (
            <div key={vacancy.id}>
              <CardVacancy vacancy={vacancy} />
            </div>
          ))
        ) : (
          <div className="p-10 self-center">
            <h1 className="text-xl">Nenhuma vaga encontrada... </h1>
          </div>
        )}
        {hasMoreVacancies ? (
          <button
            className="btn btn-primary w-1/2 self-center"
            onClick={moreVacancies}
          >
            Ver mais
          </button>
        ) : (
          <div className="p-10 self-center">
            <h1 className="text-xl">Não há mais vagas, mude sua filtragem</h1>
          </div>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    const student = await apiClient.get<Student>("/students/profile");
    const cities = await apiClient.get<City[]>("/cities");
    const states: any = [];
    cities.data.forEach((city) => {
      if (!states.includes(city.state)) {
        states.push(city.state);
      }
    });
    const initialCities = cities.data.filter(
      (city) => city.state === student.data.city.state
    );

    const vacancies = await apiClient.get<Vacancy[]>("/vacancies", {
      params: {
        limit: VACANCIES_STUDENT_LIMIT,
        city: student.data.city.id,
      },
    });
    return {
      props: {
        vacanciesData: vacancies.data,
        initialCities,
        states,
        student: student.data,
      },
    };
  } catch (error: any) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

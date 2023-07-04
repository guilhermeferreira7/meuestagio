import { GetServerSideProps } from "next";
import React, { useState } from "react";

import { getAPIClient } from "../../../services/api/clientApi";
import { Student } from "../../../utils/types/users/student";
import { Vacancy } from "../../../utils/types/vacancy";
import { City } from "../../../utils/types/city";
import { api } from "../../../services/api/api";
import { Region } from "../../../utils/types/region";
import { VACANCIES_STUDENT_LIMIT } from "../../../constants/request";
import Filters from "./_filters";
import SearchBox from "./_search";
import ListVacancies from "./_list-vacancies";
import { useRouter } from "next/router";

interface StudentPageProps {
  vacanciesData: Vacancy[];
  student: Student;
  states: string[];
}

export default function StudentVacancies({
  vacanciesData,
  student,
  states,
}: StudentPageProps) {
  const [filters, setFilters] = useState<{
    state?: string;
    region?: string;
    city?: string;
    search?: string;
  }>({ city: student.city.id + "" });
  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cityName, setCityName] = useState<string>(student.city.name);
  const [regionName, setRegionName] = useState<string>("");
  const [hasMoreVacancies, setHasMoreVacancies] = useState<boolean>(true);
  const [vacancies, setVacancies] = useState<Vacancy[]>(vacanciesData);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const search = async (searchTerm: string) => {
    const vacancies = await api.get<Vacancy[]>("/vacancies", {
      params: {
        search: searchTerm,
      },
    });

    setVacancies(vacancies.data);
    setFilters({ search: searchTerm });
  };

  const onStateChange = async (state: string) => {
    setHasMoreVacancies(true);
    if (!state) {
      const vacanciesData = await api.get<Vacancy[]>("/vacancies", {
        params: {
          limit: VACANCIES_STUDENT_LIMIT,
        },
      });
      setVacancies(vacanciesData.data);
      setFilters({});
      return;
    }

    const cities = await api.get<City[]>("/cities", {
      params: {
        state,
      },
    });
    const regions = await api.get<Region[]>("/cities/regions", {
      params: {
        state,
      },
    });

    const vacanciesData = await api.get<Vacancy[]>("/vacancies", {
      params: {
        page: 0,
        limit: VACANCIES_STUDENT_LIMIT,
        state,
      },
    });
    setVacancies(vacanciesData.data);
    setCities(cities.data);
    setRegions(regions.data);
    setFilters({ state });
  };

  const onRegionChange = async (region: string) => {
    setHasMoreVacancies(true);
    if (!region) {
      const vacanciesData = await api.get<Vacancy[]>("/vacancies", {
        params: {
          state: filters.state,
          limit: VACANCIES_STUDENT_LIMIT,
        },
      });
      setVacancies(vacanciesData.data);
      setFilters({ state: filters.state });
      return;
    }
    setRegionName(JSON.parse(region).name);
    setFilters({ region: JSON.parse(region).id, state: filters.state });
    setHasMoreVacancies(true);

    const vacanciesData = await api.get<Vacancy[]>("/vacancies", {
      params: {
        page: 0,
        limit: VACANCIES_STUDENT_LIMIT,
        region: JSON.parse(region).id,
      },
    });
    setVacancies(vacanciesData.data);
  };

  const onCityChange = async (city: City | null) => {
    setHasMoreVacancies(true);
    if (!city) {
      const vacanciesData = await api.get<Vacancy[]>("/vacancies", {
        params: {
          region: filters.region,
          limit: VACANCIES_STUDENT_LIMIT,
        },
      });
      setVacancies(vacanciesData.data);
      setFilters({ region: filters.region });
      return;
    }

    setCityName(city.name);
    const vacanciesData = await api.get<Vacancy[]>("/vacancies", {
      params: {
        city: city.id,
      },
    });
    setVacancies(vacanciesData.data);
    setFilters({ region: filters.region, city: city.id + "" });
  };

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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2 className="text-lg">
        {filters.city
          ? `Vagas em ${cityName} (cidade)`
          : filters.region
          ? `Vagas em ${regionName} (região)`
          : filters.state
          ? `Vagas em ${filters.state} (estado)`
          : filters.search
          ? `Busca: ${filters.search}`
          : "Vagas em todo o Brasil"}
      </h2>

      <Filters
        states={states}
        onStateChange={onStateChange}
        onRegionChange={onRegionChange}
        cities={cities}
        regions={regions}
        onCityChange={onCityChange}
      />

      <SearchBox
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        search={search}
      />

      <ListVacancies
        vacancies={vacancies}
        hasMoreVacancies={hasMoreVacancies}
        moreVacancies={moreVacancies}
      />
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

    const vacancies = await apiClient.get<Vacancy[]>("/vacancies", {
      params: {
        limit: VACANCIES_STUDENT_LIMIT,
        city: student.data.city.id,
      },
    });
    return {
      props: {
        vacanciesData: vacancies.data,
        states,
        student: student.data,
      },
    };
  } catch (error: any) {
    if (error.response?.status === 401) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } else {
      console.log(error.response?.data?.message);
    }
  }

  return {
    props: {},
  };
};

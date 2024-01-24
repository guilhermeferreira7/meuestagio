import { useEffect, useState } from "react";

import { CITIES_PATH } from "app-constants";
import { api } from "services";
import { City } from "types";

export function useActions(cities: City[]) {
  const [citiesUpdated, setcitiesUpdated] = useState(cities);
  const [page, setpage] = useState(1);

  useEffect(() => {
    const fetchCities = async () => {
      const { data: cities } = await api.get(CITIES_PATH, {
        params: {
          page: (page - 1) * 10,
          limit: 10,
        },
      });
      setcitiesUpdated(cities);
    };

    fetchCities();
  }, [page]);

  const prevPage = () => {
    if (page <= 1) return;
    setpage((val) => val - 1);
  };
  const nextPage = () => {
    if (citiesUpdated.length < 10) return;
    setpage((val) => val + 1);
  };

  return {
    prevPage,
    nextPage,
    citiesUpdated,
    page,
  };
}

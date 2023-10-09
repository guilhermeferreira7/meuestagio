import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";

import { notify } from "../components/toasts/toast";
import { CITIES_PATH, JOBS_PATH, REGIONS_PATH } from "../constants/api-routes";
import { JOBS_LIST_STUDENT_LIMIT } from "../constants/request";
import { api } from "../services/api/api";
import { Job } from "../types/job";
import { Student } from "../types/users/student";
import { City } from "../types/city";
import { Region } from "../types/region";
import { errorToString } from "../utils/helpers/error-to-string";

type UseJobsProps = {
  jobs: Job[];
  student: Student;
};

export function useJobsListing({ jobs: initialJobs, student }: UseJobsProps) {
  const [state, setState] = useState<string | undefined>("");
  const [cityName, setCityName] = useState<string | undefined>("");
  const [regionName, setRegionName] = useState<string>("");
  const [filters, setFilters] = useState<any>({});

  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [hasMoreJobs, setHasMoreJobs] = useState<boolean>(false);

  const [currentSearch, setCurrentSearch] = useState<string>("");

  useEffect(() => {
    const { ["meuestagio.filter"]: cookie } = parseCookies();

    if (cookie) {
      const filter = JSON.parse(cookie);
      setFilters(filter);
      if (filter.state) setState(filter.state);
      if (filter.cityName) setCityName(filter.cityName);
      if (filter.regionName) setRegionName(filter.regionName);
    }
  }, []);

  useEffect(() => {
    async function updateJobs() {
      try {
        const response = await api.get<Job[]>(JOBS_PATH, {
          params: {
            limit: JOBS_LIST_STUDENT_LIMIT,
            search: currentSearch,
            ...filters,
          },
        });
        setJobs(response.data);
        setHasMoreJobs(response.data.length > JOBS_LIST_STUDENT_LIMIT - 1);
      } catch (error) {
        notify.error(errorToString(error));
      }
    }
    updateJobs();

    if (filters) {
      setCookie(
        undefined,
        "meuestagio.filter",
        JSON.stringify({
          ...filters,
          regionName,
          cityName,
        }),
        {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        }
      );
    }
  }, [filters, currentSearch]);

  function cleanFilters() {
    setFilters({});
    setCityName("");
    setState("");
    setCurrentSearch("");
  }

  async function search(searchTerm: string) {
    if (searchTerm) setCurrentSearch(searchTerm);
  }

  async function onStateChange(state: string) {
    if (state) {
      const cities = await api.get<City[]>(CITIES_PATH, {
        params: {
          state,
          orderBy: "name",
        },
      });
      const regions = await api.get<Region[]>(REGIONS_PATH, {
        params: {
          state,
          orderBy: "name",
        },
      });
      setRegions(regions.data);
      setState(state);
      setCities(cities.data);
      setFilters({ state });
    } else {
      setFilters({});
      setCities([]);
      setState("");
      setRegions([]);
    }
  }

  async function onRegionChange(region: string) {
    if (region) {
      const cities = await api.get<City[]>(CITIES_PATH, {
        params: {
          region: JSON.parse(region).id,
          orderBy: "name",
        },
      });
      setCities(cities.data);
      setFilters({ region: JSON.parse(region).id });
      setRegionName(JSON.parse(region).name);
    } else {
      const cities = await api.get<City[]>(CITIES_PATH, {
        params: {
          orderBy: "name",
          state,
        },
      });
      setCities(cities.data);
      setFilters({ state });
    }
  }

  async function onCityChange(city: string) {
    if (city) {
      setFilters({ city: JSON.parse(city).id });
      setCityName(JSON.parse(city).name);
    } else {
      setFilters({ state });
    }
  }

  const moreJobs = async () => {
    try {
      const response = await api.get<Job[]>(JOBS_PATH, {
        params: {
          page: jobs.length,
          limit: JOBS_LIST_STUDENT_LIMIT,
          search: currentSearch,
          ...filters,
        },
      });
      setJobs([...jobs, ...response.data]);
      setHasMoreJobs(response.data.length > JOBS_LIST_STUDENT_LIMIT - 1);
    } catch (error) {}
  };

  return {
    pageData: {
      jobs,
      cities,
      regions,
      state,
      cityName,
      regionName,
      filters,
      hasMoreJobs,
      currentSearch,
    },
    pageFunctions: {
      cleanFilters,
      search,
      onStateChange,
      onRegionChange,
      onCityChange,
      moreJobs,
    },
  };
}

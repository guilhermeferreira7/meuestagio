import { useState } from "react";

import { notify } from "../components/toasts/toast";
import { CITIES_PATH, JOBS_PATH, REGIONS_PATH } from "../constants/api-routes";
import { JOBS_LIST_STUDENT_LIMIT } from "../constants/request";
import { api } from "../services/api/api";
import { Job } from "../types/job";
import { Student } from "../types/users/student";
import { City } from "../types/city";
import { Region } from "../types/region";

type UseJobsProps = {
  jobs: Job[];
  student: Student;
};

export function useJobsListing({ jobs: initialJobs, student }: UseJobsProps) {
  const [state, setState] = useState<string | undefined>(student?.city.state);
  const [cityName, setCityName] = useState<string | undefined>(
    student?.city.name
  );
  const [regionName, setRegionName] = useState<string>("");
  const [filters, setFilters] = useState<any>({ city: student?.city.id + "" });

  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [currentSearch, setCurrentSearch] = useState<string>("");

  const [hasMoreJobs, setHasMoreJobs] = useState<boolean>(false);

  function cleanFilters() {
    updateFilters({});
    setFilters({});
    setCityName("");
    setState("");
    setCurrentSearch("");
  }

  async function search(searchTerm: string) {
    setCurrentSearch(searchTerm);
    if (!searchTerm) {
      return;
    }
    try {
      const jobs = await api.get<Job[]>(JOBS_PATH, {
        params: {
          search: searchTerm,
          remote: isRemote,
          limit: JOBS_LIST_STUDENT_LIMIT,
        },
      });
      setJobs(jobs.data);
      setFilters({ search: searchTerm });
      setHasMoreJobs(jobs.data.length > JOBS_LIST_STUDENT_LIMIT - 1);
    } catch (error: any) {
      notify.error(error.response?.data?.message);
    }
  }

  async function onStateChange(state: string) {
    if (state) {
      updateFilters({ state, search: currentSearch });
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
      updateFilters({ search: currentSearch });
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
      updateFilters({ region: JSON.parse(region).id, search: currentSearch });
      setRegionName(JSON.parse(region).name);
    } else {
      const cities = await api.get<City[]>(CITIES_PATH, {
        params: {
          orderBy: "name",
        },
      });
      setCities(cities.data);
      updateFilters({ state });
      setFilters({ state });
    }
  }

  async function onCityChange(city: string) {
    if (city) {
      setFilters({ city: JSON.parse(city).id });
      setCityName(JSON.parse(city).name);
      updateFilters({ city: JSON.parse(city).id, search: currentSearch });
    } else {
      setFilters({ state });
      updateFilters({ state });
    }
  }

  async function updateFilters(filter: any) {
    try {
      const jobs = await api.get<Job[]>(JOBS_PATH, {
        params: {
          ...filter,
          limit: JOBS_LIST_STUDENT_LIMIT,
        },
      });
      setJobs(jobs.data);
      setHasMoreJobs(jobs.data.length > JOBS_LIST_STUDENT_LIMIT - 1);
    } catch (error: any) {
      notify.error(error.response?.data?.message);
    }
  }

  const moreJobs = async () => {
    try {
      const response = await api.get(JOBS_PATH, {
        params: {
          page: jobs.length,
          limit: JOBS_LIST_STUDENT_LIMIT,
          ...filters,
        },
      });
      setHasMoreJobs(response.data.length > JOBS_LIST_STUDENT_LIMIT - 1);
      setJobs([...jobs, ...response.data]);
    } catch (error: any) {
      notify.error(error.response?.data?.message);
    }
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
      setIsRemote,
      moreJobs,
    },
  };
}

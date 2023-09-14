import { notify } from "@components/toasts/toast";
import { VACANCIES_STUDENT_LIMIT } from "@constants/request";
import { City } from "@customTypes/city";
import { Job } from "@customTypes/job";
import { Region } from "@customTypes/region";
import { Student } from "@customTypes/users/student";
import { api } from "@services/api/api";
import { useState } from "react";

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
      const jobs = await api.get<Job[]>("/jobs", {
        params: {
          search: searchTerm,
          remote: isRemote,
          limit: VACANCIES_STUDENT_LIMIT,
        },
      });
      setJobs(jobs.data);
      setFilters({ search: searchTerm });
      setHasMoreJobs(jobs.data.length > VACANCIES_STUDENT_LIMIT - 1);
    } catch (error: any) {
      notify.error(error.response?.data?.message);
    }
  }

  async function onStateChange(state: string) {
    if (state) {
      updateFilters({ state, search: currentSearch });
      const cities = await api.get<City[]>("/cities", {
        params: {
          state,
          orderBy: "name",
        },
      });
      const regions = await api.get<Region[]>("/cities/regions", {
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
      const cities = await api.get<City[]>("/cities", {
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
      const cities = await api.get<City[]>("/cities", {
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
      const jobs = await api.get<Job[]>("/jobs", {
        params: {
          ...filter,
          limit: VACANCIES_STUDENT_LIMIT,
        },
      });
      setJobs(jobs.data);
      setHasMoreJobs(jobs.data.length > VACANCIES_STUDENT_LIMIT - 1);
    } catch (error: any) {
      notify.error(error.response?.data?.message);
    }
  }

  const moreJobs = async () => {
    try {
      const response = await api.get("/jobs", {
        params: {
          page: jobs.length,
          limit: VACANCIES_STUDENT_LIMIT,
          ...filters,
        },
      });
      setHasMoreJobs(response.data.length > VACANCIES_STUDENT_LIMIT - 1);
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

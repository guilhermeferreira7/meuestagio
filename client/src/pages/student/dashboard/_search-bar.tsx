import { City } from "@customTypes/city";
import { Region } from "@customTypes/region";
import { Student } from "@customTypes/users/student";
import React from "react";

type SearchBarProps = {
  student: Student;
  states: string[];
  regions: Region[];
  cities: City[];
  search: (search: string) => void;
  onStateChange: (state: string) => void;
  onRegionChange: (region: string) => void;
  onCityChange: (city: string) => void;
  setIsRemote: (isRemote: boolean) => void;
};

export default function SearchBar({
  student,
  states,
  regions,
  cities,
  onStateChange,
  onRegionChange,
  onCityChange,
  setIsRemote,
  search,
}: SearchBarProps) {
  return (
    <>
      <form
        className="w-10/12 flex flex-col gap-2 items-center justify-center my-4"
        onSubmit={(e) => {
          e.preventDefault();
          const searchTerm = e.currentTarget.search.value;
          search(searchTerm);
        }}
      >
        <div className="flex gap-1 w-full">
          <input
            id="search"
            type="text"
            placeholder="Pesquisar vagas"
            className="w-full pl-2 input input-primary"
          />
          <button className="btn btn-primary">Buscar</button>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-1">
            <select
              className="select select-primary w-full md:w-1/3"
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
              name="region"
              id="region"
              className="select select-primary w-full md:w-1/3"
              onChange={(e) => onRegionChange(e.target.value)}
            >
              <option value="">Qualquer região</option>
              {regions?.map((region: Region) => (
                <option key={region.id} value={JSON.stringify(region)}>
                  {region.name}
                </option>
              ))}
            </select>
            <select
              className="select select-primary w-full md:w-1/3"
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
          <div className="flex items-center gap-1 self-start">
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
        </div>
      </form>
    </>
  );
}

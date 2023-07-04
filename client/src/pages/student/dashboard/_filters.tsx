import React from "react";
import { Region } from "../../../utils/types/region";
import { City } from "../../../utils/types/city";

interface PageProps {
  states: string[];
  regions: Region[];
  cities: City[];
  onStateChange: (state: string) => void;
  onRegionChange: (region: string) => void;
  onCityChange: (city: City | null) => Promise<void>;
}

export default function Filters({
  states,
  regions,
  cities,
  onStateChange,
  onCityChange,
  onRegionChange,
}: PageProps) {
  return (
    <>
      <div className="collapse text-center">
        <input type="checkbox" />

        <div className="collapse-title underline lg:w-full text-primary font-bold">
          Alterar localização
        </div>
        <div className="collapse-content flex gap-1">
          <select
            className="select select-primary"
            defaultValue=""
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
            className="select select-primary"
            defaultValue=""
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
            className="select select-primary"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onCityChange(JSON.parse(e.target.value));
              } else {
                onCityChange(null);
              }
            }}
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
    </>
  );
}

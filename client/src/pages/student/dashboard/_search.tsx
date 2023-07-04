import React, { useState } from "react";
import { api } from "../../../services/api/api";
import { Vacancy } from "../../../utils/types/vacancy";

interface SearchBoxProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  search: (searchTerm: string) => Promise<void>;
}

export default function SearchBox({
  searchTerm,
  setSearchTerm,
  search,
}: SearchBoxProps) {
  return (
    <>
      <div className="flex flex-row justify-center my-4 ">
        <div className="flex flex-col items-center gap-2 mx-2">
          <div className="w-96 flex flex-col items-center gap-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                search(searchTerm);
              }}
            >
              <input
                type="text"
                placeholder="Pesquisar vagas"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-2 input input-primary"
              />
              <div className="flex justify-center items-center gap-1">
                <span>Vagas remotas?</span>
                <input type="checkbox" className="checkbox checkbox-primary" />
                <button className="btn btn-primary w-5/6">Buscar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

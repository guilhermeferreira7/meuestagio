import React from "react";

interface SearchBoxProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setRemote: React.Dispatch<React.SetStateAction<boolean>>;
  search: (searchTerm: string) => Promise<void>;
}

export default function SearchBox({
  searchTerm,
  setSearchTerm,
  search,
  setRemote,
}: SearchBoxProps) {
  return (
    <>
      <div className="flex flex-row justify-center my-4 ">
        <div className="flex flex-col items-center gap-2 mx-2">
          <form
            className="w-96 flex flex-col items-center gap-2"
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
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                onChange={(e) => setRemote(e.target.checked)}
              />
              <button className="btn btn-primary w-5/6">Buscar</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

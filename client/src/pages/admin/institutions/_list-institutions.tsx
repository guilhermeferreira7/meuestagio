import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Institution } from "@customTypes/institution";
import { api } from "@services/api/api";

import DeleteInstitutionForm from "./_form-delete";
import { notify } from "@components/toasts/toast";
import { usePagination } from "../../../hooks/usePagination";

interface ListInstitutionsProps {
  institutions: Institution[];
}

export default function ListInstitutions({
  institutions,
}: ListInstitutionsProps) {
  const limit = 10;
  const {
    counter: counterPagination,
    handleChangePage,
    page: pagePagination,
    updatedData,
  } = usePagination<Institution>({
    data: institutions,
    route: "/institutions",
    limit,
  });

  const [counter, setCounter] = useState(0);
  const [page, setPage] = useState(0);

  const [search, setSearch] = useState("");
  const [institutionsUpdated, setInstitutionsUpdated] =
    useState<Institution[]>(institutions);

  useEffect(() => {
    setInstitutionsUpdated(updatedData);
    setCounter(counterPagination);
    setPage(pagePagination);
  }, [updatedData, counterPagination, pagePagination]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSearch(e.currentTarget.search.value);
    setPage(0);
    setCounter(0);
    try {
      const res = await api.get<Institution[]>("institutions", {
        params: {
          page: 0,
          limit,
          name: e.currentTarget.search.value,
        },
      });
      setInstitutionsUpdated(res.data);
    } catch (error: any) {
      notify.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <form className="flex gap-1 my-2" onSubmit={handleSearch}>
        <div className="flex flex-col flex-1">
          <label htmlFor="search" className="font-semibold">
            Pesquisar
          </label>
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Nome da instituição"
            className="input input-primary"
          />
        </div>
        <button type="submit" className="btn btn-info self-end">
          <Search />
        </button>
      </form>
      {search && (
        <div className="flex justify-between">
          <span className="italic">
            Resultados para: <strong>{search}</strong>
          </span>
          <button
            className="text-error text-lg underline"
            onClick={() => {
              handleChangePage(0);
              setSearch("");
            }}
          >
            Limpar pesquisa
          </button>
        </div>
      )}
      <div className="overflow-x-auto w-full">
        <table className="table w-full min-h-16">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Cidade</th>
              <th className="text-center">Nome</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {institutionsUpdated.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center">
                  Não existem mais instituições
                </td>
              </tr>
            )}
            {institutionsUpdated.map((i) => (
              <DeleteInstitutionForm
                key={i.id}
                institution={i}
                update={setInstitutionsUpdated}
              />
            ))}
          </tbody>
        </table>
        {!search && (
          <div className="join text-center">
            <button
              className="join-item btn btn-primary"
              onClick={() => {
                handleChangePage(page - limit);
              }}
              disabled={page === 0}
            >
              «
            </button>
            <button
              className="join-item border rounded-md p-3 mx-1 border-primary text-primary font-semibold"
              disabled
            >
              Página {counter}
            </button>
            <button
              className="join-item btn btn-primary"
              onClick={() => {
                handleChangePage(page + limit);
              }}
              disabled={institutionsUpdated.length < limit}
            >
              »
            </button>
          </div>
        )}
      </div>
    </>
  );
}
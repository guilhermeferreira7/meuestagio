import { useState } from "react";
import { Search } from "lucide-react";

import { Institution } from "@customTypes/institution";
import { api } from "@services/api/api";

import DeleteInstitutionForm from "./_form-delete";
import { notify } from "@components/toasts/toast";

interface ListInstitutionsProps {
  institutions: Institution[];
}

export default function ListInstitutions({
  institutions,
}: ListInstitutionsProps) {
  const [page, setPage] = useState(0);
  const [counter, setCounter] = useState(1);
  const [institutionsUpdated, setInstitutionsUpdated] =
    useState<Institution[]>(institutions);

  const handleChangePage = async (next: number) => {
    try {
      const res = await api.get<Institution[]>("institutions", {
        params: {
          page: next,
          limit: 3,
        },
      });
      setPage(next);
      setInstitutionsUpdated(res.data);
    } catch (error: any) {
      notify.error(error.response?.data?.message || error.message);
    } finally {
      if (next < page) {
        setCounter(counter - 1);
      } else {
        setCounter(counter + 1);
      }
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const search = e.currentTarget.search.value;
    try {
      const res = await api.get<Institution[]>("institutions", {
        params: {
          page: 0,
          limit: 3,
          name: search,
        },
      });
      setInstitutionsUpdated(res.data);
    } catch (error: any) {
      notify.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-2">Instituições cadastradas</h2>
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
        <button className="btn btn-info self-end">
          <Search />
        </button>
      </form>
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
            {institutionsUpdated.map((i) => (
              <DeleteInstitutionForm key={i.id} institution={i} />
            ))}
          </tbody>
        </table>
        <div className="join text-center">
          <button
            className="join-item btn btn-primary"
            onClick={() => {
              handleChangePage(page - 3);
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
              handleChangePage(page + 3);
            }}
            disabled={institutionsUpdated.length < 3}
          >
            »
          </button>
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";

import { INSTITUTIONS_PATH, INSTITUTION_PATH } from "app-constants";
import { notify } from "components";
import { api } from "services";
import { Institution } from "types";

export function useActions(institutions: Institution[]) {
  const [institutionsUpdated, setInstitutionsUpdated] = useState(institutions);
  const [page, setpage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const { data: institutions } = await api.get(INSTITUTIONS_PATH, {
        params: {
          page: (page - 1) * 10,
          limit: 10,
          orderBy: "name",
          order: "ASC",
        },
      });
      setInstitutionsUpdated(institutions);
    };

    fetchData();
  }, [page]);

  const prevPage = () => {
    if (page <= 1) return;
    setpage((val) => val - 1);
  };
  const nextPage = () => {
    if (institutionsUpdated.length < 10) return;
    setpage((val) => val + 1);
  };

  const handleDelete = async (institution: Institution) => {
    try {
      await api.delete(INSTITUTION_PATH(institution.id));
      notify.success(`Instituição ${institution.name} deletada com sucesso!`);
      const { data: institutions } = await api.get(INSTITUTIONS_PATH);
      setInstitutionsUpdated(institutions);
    } catch (error: any) {
      notify.error(error.response?.data?.message);
    }
  };

  return {
    prevPage,
    nextPage,
    institutionsUpdated,
    page,
    handleDelete,
  };
}

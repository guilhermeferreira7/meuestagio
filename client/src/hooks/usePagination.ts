import { useState } from "react";
import { api } from "../services/api/api";
import { notify } from "../components/toasts/toast";

type PaginationProps<T> = {
  data: T[];
  limit: number;
  route: string;
};

export function usePagination<T>({ data, limit, route }: PaginationProps<T>) {
  const [page, setPage] = useState(0);
  const [counter, setCounter] = useState(1);
  const [updatedData, setUpdatedData] = useState<T[]>(data);

  const handleChangePage = async (next: number) => {
    try {
      const res = await api.get<T[]>(route, {
        params: {
          page: next,
          limit,
        },
      });
      setPage(next);
      setUpdatedData(res.data);
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

  return {
    page,
    counter,
    updatedData,
    handleChangePage,
  };
}

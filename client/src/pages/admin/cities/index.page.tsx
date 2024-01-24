import { Add, ArrowBack, ArrowForward } from "@mui/icons-material";
import Link from "next/link";

import { CITIES_PATH } from "app-constants";
import { serverApi, withAdminAuth } from "services";
import { City } from "types";
import { errorToString } from "utils";

import { useActions } from "./_useActions";

type RegisterCityProps = {
  cities: City[];
};

export default function _page({ cities }: RegisterCityProps) {
  const { citiesUpdated, nextPage, prevPage, page } = useActions(cities);

  return (
    <>
      <h2 className="text-xl font-bold mb-2 flex justify-between items-center w-full px-10">
        <span className="text-primary">Cidades cadastradas</span>
        <Link
          href="cities/new"
          className="btn btn-primary btn-md flex items-center"
        >
          <Add /> Nova cidade
        </Link>
      </h2>

      <div className="w-4/5">
        <table className="table min-w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Cidade</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {citiesUpdated.map((city) => (
              <tr key={city.id}>
                <td>{city.id}</td>
                <td>{city.name}</td>
                <td>{city.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="col-span-3 flex justify-center items-center">
        <button className="btn btn-sm btn-primary" onClick={prevPage}>
          <ArrowBack />
        </button>
        <span className="p-2">{page}</span>
        <button className="btn btn-sm btn-primary" onClick={nextPage}>
          <ArrowForward />
        </button>
      </div>
    </>
  );
}

export const getServerSideProps = withAdminAuth(async (context, _user) => {
  const apiServer = serverApi(context);
  try {
    const { data: cities } = await apiServer.get(CITIES_PATH, {
      params: {
        page: 0,
        limit: 10,
      },
    });

    return {
      props: {
        cities,
      },
    };
  } catch (err) {
    console.log(errorToString(err));
    return {
      props: {},
    };
  }
});

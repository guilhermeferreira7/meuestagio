import { GetServerSideProps } from "next";
import React from "react";

import { User } from "../../../utils/types/users/user";
import { getAPIClient } from "../../../services/api/clientApi";
import { ChevronDown } from "lucide-react";
import { City } from "../../../utils/types/city";

interface AdminDashboardProps {
  cities: City[];
}

export default function AdminDashboard({ cities }: AdminDashboardProps) {
  return (
    <div className="flex flex-col w-full items-center my-5">
      <div tabIndex={0} className="collapse collapse-arrow border w-1/2">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          Ultimas cidades cadastradas
        </div>
        <div className="collapse-content w-full">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cidade</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city.id}>
                    <th>{city.id}</th>
                    <td>{city.name}</td>
                    <td>{city.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    await apiClient.get<User>("/admin/profile");
    const citiesResponse = await apiClient.get<City[]>("/cities", {
      params: { page: 0, limit: 5 },
    });
    const cities = citiesResponse.data;
    return {
      props: {
        cities,
      },
    };
  } catch (error: any) {
    if (error.response.status === 401) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
};

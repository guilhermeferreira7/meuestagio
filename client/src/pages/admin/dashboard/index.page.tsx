import { GetServerSideProps } from "next";
import React from "react";

import { User } from "@customTypes/users/user";
import { getAPIClient } from "../../../services/api/clientApi";
import { City } from "@customTypes/city";

interface AdminDashboardProps {
  cities: City[];
}

export default function AdminDashboard({ cities }: AdminDashboardProps) {
  return (
    <>
      <div className="w-11/12 flex justify-center">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  try {
    await apiClient.get<User>("/admin/profile");
    return {
      props: {},
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

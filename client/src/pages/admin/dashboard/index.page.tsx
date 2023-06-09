import { GetServerSideProps } from "next";
import React from "react";

import { User } from "../../../utils/types/users/user";
import { getAPIClient } from "../../../services/api/clientApi";

export default function AdminDashboard() {
  return <div>AdminDashboard</div>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    await apiClient.get<User>("/admin/profile");
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

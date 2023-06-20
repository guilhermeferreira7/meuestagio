import React from "react";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../../services/api/clientApi";
import { User } from "../../../utils/types/users/user";
import ibgeApi from "../../../services/api/ibgeApi";

interface AdminRegisterProps {
  states: any;
}

export default function AdminRegister({ states }: AdminRegisterProps) {
  return (
    <div className="my-5 w-full">
      <div className="flex flex-col items-center justify-center w-full gap-2"></div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    const states = await ibgeApi.get("/estados", {
      params: { orderBy: "nome" },
    });
    await apiClient.get<User>("/admin/profile");
    return {
      props: {
        states: states.data,
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

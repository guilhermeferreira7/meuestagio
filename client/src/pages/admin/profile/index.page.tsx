import { GetServerSideProps } from "next";

import { getAPIClient } from "../../../services/api/clientApi";
import { PROFILE_ADMIN_PATH } from "../../../constants/api-routes";
import { User } from "../../../types/users/user";

export default function AdminProfile() {
  return (
    <>
      <h1 className="font-bold text-2xl">Logado como admin</h1>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    await apiClient.get<User>(PROFILE_ADMIN_PATH);
    return {
      props: {},
    };
  } catch (error: any) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

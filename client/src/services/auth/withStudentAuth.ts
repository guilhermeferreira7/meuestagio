import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { isAxiosError } from "axios";
import { parseCookies } from "nookies";

import { errorToString } from "../../utils/helpers/error-to-string";
import { Role, UserAuth } from "@customTypes/auth/user-auth";
import { redirect } from "next/dist/server/api-utils";

export default function withStudentAuth(
  getServerSidePropsCallback: (
    context: GetServerSidePropsContext,
    user: UserAuth
  ) => Promise<GetServerSidePropsResult<unknown>>
) {
  return async (context: GetServerSidePropsContext) => {
    const { ["meuestagio.user"]: cookie } = parseCookies(context);
    const user: UserAuth | undefined = cookie ? JSON.parse(cookie) : undefined;

    if (user?.role === Role.Student) {
      return await getServerSidePropsCallback(context, user);
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }
  };
}

import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

import { Role, UserAuth } from "types";

export function withStudentAuth(
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

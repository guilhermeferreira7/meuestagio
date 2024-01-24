import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

import { Role, UserAuth } from "types";

export function withProfessorAuth(
  getServerSidePropsCallback: (
    context: GetServerSidePropsContext,
    professor: any
  ) => Promise<GetServerSidePropsResult<unknown>>
) {
  return async (context: any) => {
    const { ["meuestagio.user"]: cookie } = parseCookies(context);
    const user: UserAuth | undefined = cookie ? JSON.parse(cookie) : undefined;

    if (user?.role === Role.Professor) {
      return getServerSidePropsCallback(context, user);
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

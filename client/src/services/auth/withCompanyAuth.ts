import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { isAxiosError } from "axios";
import { getAPIClient } from "../api/clientApi";
import { Company } from "../../types/users/company";
import { PROFILE_COMPANY_PATH } from "../../constants/api-routes";

export default function withCompanyAuth(
  getServerSidePropsCallback: (
    context: GetServerSidePropsContext,
    company: Company,
    apiClient: ReturnType<typeof getAPIClient>
  ) => Promise<GetServerSidePropsResult<unknown>>
) {
  return async (context: any) => {
    try {
      const apiClient = getAPIClient(context);
      const company = await apiClient.get<Company>(PROFILE_COMPANY_PATH);
      if (company.data) {
        return await getServerSidePropsCallback(
          context,
          company.data,
          getAPIClient(context)
        );
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403)
          return {
            notFound: true,
          };
      }

      return {
        props: {},
      };
    }
  };
}

import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { isAxiosError } from "axios";
import { getAPIClient } from "../api/clientApi";
import { Student } from "../../types/users/student";
import { PROFILE_STUDENT_PATH } from "../../constants/api-routes";
import { errorToString } from "../../utils/helpers/error-to-string";

export default function withStudentAuth(
  getServerSidePropsCallback: (
    context: GetServerSidePropsContext,
    student: Student,
    apiClient: ReturnType<typeof getAPIClient>
  ) => Promise<GetServerSidePropsResult<unknown>>
) {
  return async (context: any) => {
    try {
      const apiClient = getAPIClient(context);
      const student = await apiClient.get<Student>(PROFILE_STUDENT_PATH);
      if (student.data) {
        return await getServerSidePropsCallback(
          context,
          student.data,
          getAPIClient(context)
        );
      }
    } catch (error) {
      console.log(errorToString(error));
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

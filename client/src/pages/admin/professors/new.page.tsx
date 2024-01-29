import { COURSES_PATH } from "app-constants";
import { serverApi, withAdminAuth } from "services";
import { Course } from "types";
import { errorToString } from "utils";

import FormNewProfessor from "./_form-new-professor";

type NewProfessorPageProps = {
  courses: Course[];
};

export default function _screen({ courses }: NewProfessorPageProps) {
  return (
    <>
      <h1 className="text-primary font-bold text-xl">Novo professor</h1>

      <FormNewProfessor courses={courses} />
    </>
  );
}

export const getServerSideProps = withAdminAuth(async (context, _user) => {
  const apiServer = serverApi(context);
  try {
    const { data: courses } = await apiServer.get<Course>(COURSES_PATH);

    return {
      props: {
        courses,
      },
    };
  } catch (err) {
    console.log(errorToString(err));
    return {
      props: {},
    };
  }
});

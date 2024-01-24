import { useState } from "react";

import { COURSES_PATH, COURSE_PATH } from "app-constants";
import { notify } from "components";
import { api } from "services";
import { Course } from "types";

export function useActions(courses: Course[]) {
  const [coursesUpdated, setCoursesUpdated] = useState<Course[]>(courses);

  const [courseSelected, setCourseSelected] = useState<Course | undefined>();

  const handleDelete = async (course: Course) => {
    try {
      await api.delete(COURSE_PATH(course.id));
      notify.success(`Curso ${course.name} deletado com sucesso!`);
      const { data: courses } = await api.get(COURSES_PATH);
      setCoursesUpdated(courses);
    } catch (error: any) {
      notify.error(error.response?.data?.message);
    }
  };

  return {
    courseSelected,
    coursesUpdated,
    setCourseSelected,
    handleDelete,
  };
}

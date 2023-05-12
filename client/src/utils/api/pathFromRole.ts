import { apiPaths } from "../../services/api/api-paths";
import { Role } from "../types/auth/user-auth";

export function getPathToProfile(role: string) {
  const { students, companies } = apiPaths;
  switch (role) {
    case Role.Student:
      return students.profile;
    case Role.Company:
      return companies.profile;
    case Role.Admin:
      // return admin.path
      break;
    case Role.Professor:
      // return professor.path
      break;
  }
  return "";
}

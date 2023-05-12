import { getAPIClient } from "./clientApi";
import { getRole } from "../../utils/api/roleFromCtx";
import { getPathToProfile } from "../../utils/api/pathFromRole";
import { log } from "console";

export async function getUser<T>(ctx: any): Promise<T | null> {
  const apiClient = getAPIClient(ctx);
  const role = getRole(ctx);
  const path = getPathToProfile(role);

  try {
    const res = await apiClient.get(path);
    return res.data as T;
  } catch (error: any) {
    return null;
  }
}

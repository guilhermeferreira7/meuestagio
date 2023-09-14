import { UserAuth } from "./user-auth";

export type LoginResponse = {
  user: UserAuth;
  access_token: string;
};

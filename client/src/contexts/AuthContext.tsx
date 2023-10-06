import { ReactNode, createContext, useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useRouter } from "next/router";

import { UserAuth } from "../types/auth/user-auth";
import { LoginResponse } from "../types/auth/login";
import { api } from "../services/api/api";

interface Props {
  children?: ReactNode;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserAuth | null;
  signIn: (
    email: string,
    password: string,
    userType: string,
    rememberMe?: boolean
  ) => Promise<void>;
  signOut: () => void;
  updateUserData: (user: UserAuth, access_token: string) => void;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<UserAuth | null>(null);
  const router = useRouter();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { ["meuestagio.token"]: token } = parseCookies();
    const { ["meuestagio.user"]: user } = parseCookies();
    const userObj = user ? JSON.parse(user) : null;

    if (token) {
      setUser(userObj);
    }
  }, []);

  async function signIn(
    email: string,
    password: string,
    role: string,
    rememberMe?: boolean
  ): Promise<void> {
    const path = `/auth/login/${role}`;

    const response = await api.post<LoginResponse>(path, { email, password });
    setUser({
      ...response.data.user,
      rememberMe: rememberMe || false,
    });
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.access_token}`;

    setCookie(undefined, "meuestagio.token", response.data.access_token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    setCookie(
      undefined,
      "meuestagio.user",
      JSON.stringify(response.data.user),
      {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      }
    );

    router.push(`/${role}/dashboard`);
  }

  function updateUserData(user: UserAuth, access_token: string) {
    setUser(user);

    setCookie(undefined, "meuestagio.user", JSON.stringify(user), {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    setCookie(undefined, "meuestagio.token", access_token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  }

  function signOut() {
    if (!user?.rememberMe) {
      destroyCookie(null, "meuestagio.user", { path: "/" });
    }
    destroyCookie(null, "meuestagio.token", { path: "/" });
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signOut, updateUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

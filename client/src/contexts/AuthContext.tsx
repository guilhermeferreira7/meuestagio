import { ReactNode, createContext, useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useRouter } from "next/router";

import { UserAuth } from "@customTypes/auth/user-auth";
import { LoginResponse } from "@customTypes/auth/login";
import { api } from "@services/api/api";

interface Props {
  children?: ReactNode;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserAuth | null;
  signIn: (email: string, password: string, userType: string) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<UserAuth | null>(null);
  const router = useRouter();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { ["next.token"]: token } = parseCookies();
    const { ["next.user"]: user } = parseCookies();
    const userObj = user ? JSON.parse(user) : null;

    if (token) {
      setUser(userObj);
    }
  }, []);

  async function signIn(
    email: string,
    password: string,
    role: string
  ): Promise<void> {
    const path = `/auth/login/${role}`;

    const response = await api.post<LoginResponse>(path, { email, password });
    setUser(response.data.user);
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.access_token}`;

    setCookie(undefined, "next.token", response.data.access_token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    setCookie(undefined, "next.user", JSON.stringify(response.data.user), {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    router.push(`/${role}/dashboard`);
  }

  function signOut() {
    destroyCookie(null, "next.token", { path: "/" });
    destroyCookie(null, "next.user", { path: "/" });
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

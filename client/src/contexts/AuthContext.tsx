import { ReactNode, createContext, useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useRouter } from "next/router";

import { api } from "@/services/api/api";

interface Props {
  children?: ReactNode;
}

type User = {
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (
    email: string,
    password: string,
    userType: string
  ) => Promise<User | undefined>;
  signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
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
    userType: string
  ): Promise<any> {
    const path = `/auth/login/${userType}`;

    const { user, access_token } = (await api.post(path, { email, password }))
      .data as { user: any; access_token: any };
    setUser({ ...user, role: userType });

    setCookie(undefined, "next.token", access_token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    setCookie(undefined, "next.user", JSON.stringify(user), {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    router.push(`/${userType}/dashboard`);
    return user;
  }

  function signOut() {
    destroyCookie(null, "next.token", { path: "/" });
    destroyCookie(null, "next.user", { path: "/" });
    setUser(null);
    router.push("/");
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

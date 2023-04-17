import axios from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/constants";
import { destroyCookie, setCookie } from "nookies";
import { useRouter } from "next/router";

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
    return () => {};
  }, []);

  async function signIn(
    email: string,
    password: string,
    userType: string
  ): Promise<any> {
    const path = `/auth/login/${userType}`;

    const { user, access_token } = (
      await axios.post(path, { email, password }, { baseURL: API_BASE_URL })
    ).data as { user: any; access_token: any };

    setCookie(undefined, "next.token", access_token, {
      maxAge: 60 * 60 * 24, // 1 day
    });

    setUser({ ...user, role: userType });
    router.push(`/${userType}/dashboard`);
    return user;
  }

  async function signOut() {
    destroyCookie(undefined, "next.token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

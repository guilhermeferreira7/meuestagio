import axios from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/constants";
import { setCookie } from "nookies";

interface Props {
  children?: ReactNode;
}

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (
    email: string,
    password: string,
    userType: string
  ) => Promise<User | undefined>;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

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

    setUser(user);
    return user;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

import React, { useContext } from "react";
import Link from "next/link";
import { Home, Login, Menu, School } from "@mui/icons-material";

import { AuthContext } from "../../contexts/AuthContext";
import DropDown from "../MUI/DropDown";
import { Role } from "../../types/auth/user-auth";

export default function Header() {
  const { user, isAuthenticated, signOut } = useContext(AuthContext);
  const route = !!user ? `/${user.role}/dashboard` : `/`;

  return (
    <>
      <div className="bg-base-100 w-full navbar drop-shadow-lg flex items-center justify-between px-4">
        <div className="flex-none lg:hidden">
          <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
            <Menu className="text-primary" />
          </label>
        </div>
        <div className="flex-1 px-2">
          <Link
            href={route}
            className="flex items-center gap-1 pl-2 text-2xl text-primary font-bold"
          >
            <School fontSize="large" />
            <span className="hidden sm:flex">MeuEstagio</span>
          </Link>
        </div>
        {isAuthenticated ? (
          <div className="flex items-center gap-1">
            <Link
              href={route}
              className="flex items-center gap-1 p-2 text-primary font-semibold"
            >
              <Home />
              <span className="hidden md:flex">Início</span>
            </Link>
            {user?.role === Role.Student && (
              <Link href="/student/resume" className="btn btn-primary mr-1">
                Ver currículo
              </Link>
            )}
            <DropDown
              title={user?.name || "Usuário"}
              menuList={[
                {
                  label: "Ver perfil",
                  href: `/${user?.role}/profile`,
                  btnType: "primary",
                },
                { label: "Sair da conta", action: signOut, btnType: "error" },
              ]}
            />
          </div>
        ) : (
          <Link
            className="border-0 btn hover:bg-info-content text-info flex flex-row gap-2"
            href="/login"
          >
            Login <Login />
          </Link>
        )}
      </div>
    </>
  );
}

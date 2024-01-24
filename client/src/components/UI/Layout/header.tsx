import { Add, Home, Login, Menu, School } from "@mui/icons-material";
import Link from "next/link";
import { useContext } from "react";

import { DropDown } from "components";
import { AuthContext } from "contexts/AuthContext";
import { Role } from "types";

export default function Header() {
  const { user, isAuthenticated, signOut } = useContext(AuthContext);
  const route = !!user ? `/${user.role}/dashboard` : `/`;

  return (
    <>
      <header className="bg-base-100 w-full navbar drop-shadow-lg flex items-center justify-between px-4 z-10">
        {user && (
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
              <Menu className="text-primary" />
            </label>
          </div>
        )}
        <div className="flex-1 px-2">
          <Link
            href={route}
            className="flex items-center gap-1 pl-2 text-2xl text-primary font-bold"
          >
            <School fontSize="large" />
            <span className="hidden sm:flex">MeuEstagio</span>
          </Link>
        </div>
        <Link
          href={route}
          className="flex items-center gap-1 p-2 mx-2 text-primary font-semibold hover:bg-base-200"
        >
          <Home />
          <span className="hidden md:flex">Início</span>
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-1">
            {user?.role === Role.Student && (
              <Link href="/student/resume" className="btn btn-primary mx-1">
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
          <div className="gap-2">
            <Link
              className="text-primary text-lg flex items-center gap-1 font-semibold hover:bg-base-200"
              href="/create-account"
            >
              <Add />
              <span>Criar conta</span>
            </Link>
            <Link
              className="text-primary text-lg flex items-center gap-1 font-semibold hover:bg-base-200"
              href="/login"
            >
              <Login />
              <span>Login</span>
            </Link>
          </div>
        )}
      </header>
    </>
  );
}

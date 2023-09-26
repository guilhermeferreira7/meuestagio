import { LogIn, Menu } from "lucide-react";
import React, { useContext } from "react";
import Link from "next/link";

import { AuthContext } from "../../contexts/AuthContext";
import DropDown from "../MUI/DropDown";

export default function Header() {
  const { user, isAuthenticated, signOut } = useContext(AuthContext);
  const route = !!user ? `/${user.role}/dashboard` : `/`;

  return (
    <>
      <div className="bg-base-100 w-full navbar drop-shadow-lg flex items-center justify-between px-4">
        <div className="flex-none lg:hidden">
          <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
            <Menu />
          </label>
        </div>
        <div className="flex-1 px-2">
          <Link
            href={route}
            className="pl-2 text-2xl text-primary self-center font-bold"
          >
            MeuEstagio
          </Link>
        </div>
        {isAuthenticated ? (
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
        ) : (
          <Link
            className="border-0 btn hover:bg-info-content text-info flex flex-row gap-2"
            href="/login"
          >
            Login <LogIn />
          </Link>
        )}
      </div>
    </>
  );
}

import { LogIn, LogOut, Menu } from "lucide-react";
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Link from "next/link";

export default function Header() {
  const { user, isAuthenticated, signOut } = useContext(AuthContext);
  const route = !!user ? `/${user.role}/dashboard` : `/`;

  const handleLogout = () => {
    signOut();
  };
  return (
    <div className="bg-base-100 w-full navbar drop-shadow-lg">
      <div className="flex-none lg:hidden">
        <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
          <Menu />
        </label>
      </div>
      <div className="flex-1 px-2 mx-2">
        <Link
          href={route}
          className="pl-2 text-2xl text-primary self-center font-bold"
        >
          MeuEstagio
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal">
          {isAuthenticated ? (
            <a
              className="border-0 btn hover:bg-error-content text-error flex flex-row gap-2"
              onClick={handleLogout}
            >
              Sair <LogOut />
            </a>
          ) : (
            <Link
              className="border-0 btn hover:bg-info-content text-info flex flex-row gap-2"
              href="/login"
            >
              Login <LogIn />
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
}

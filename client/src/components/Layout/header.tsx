import { LogIn, LogOut, Menu } from "lucide-react";
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Link from "next/link";

export default function Header({ menuItems }: any) {
  const { isAuthenticated, signOut } = useContext(AuthContext);

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="navbar flex flex-row w-full">
      <div className="flex w-1/2 lg:w-1/2 justify-start lg:justify-center">
        <div className="dropdown">
          <label tabIndex={0} className="text-primary lg:hidden">
            <Menu />
          </label>
          <ul
            tabIndex={0}
            className="flex flex-row justify-end menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            {menuItems.map((item: any, key: any) => (
              <li className="w-full" key={key}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <Link href="/" className="pl-2 text-2xl text-primary font-bold">
          MeuEstagio
        </Link>
      </div>
      <div className="hidden lg:w-1/2 lg:flex lg:justify-end">
        <ul className="menu menu-horizontal px-1">
          {menuItems.map((item: any, key: any) => (
            <li key={key}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="w-1/2 lg:w-1/4 justify-end">
        {isAuthenticated ? (
          <a
            className="bg-base-100 border-0 btn hover:bg-error-content text-error flex flex-row gap-2"
            onClick={handleLogout}
          >
            Sair <LogOut />
          </a>
        ) : (
          <Link
            className="bg-base-100 border-0 btn hover:bg-info-content text-info flex flex-row gap-2"
            href="/login"
          >
            Login <LogIn />
          </Link>
        )}
      </div>
    </div>
  );
}

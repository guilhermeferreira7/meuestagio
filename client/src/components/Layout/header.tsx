import Link from "next/link";
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { LogOut } from "lucide-react";

export default function LayoutHeader() {
  const { isAuthenticated, signOut } = useContext(AuthContext);

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="bg-base-300 flex flex-row flex-3 p-4 justify-center">
      <button className="bg-base-300 drawer lg:hidden h-full w-10">
        <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-6 h-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </button>
      <Link
        className="flex flex-1 justify-center items-center text-primary text-2xl font-bold"
        href="/"
      >
        MeuEstagio
      </Link>
      {isAuthenticated ? (
        <Link
          className="flex flex-row gap-2 pr-2 justify-center items-center text-warning"
          href=""
          onClick={handleLogout}
        >
          <LogOut /> Sair
        </Link>
      ) : (
        <Link className="flex justify-center items-center btn" href="/login">
          Entrar
        </Link>
      )}
    </header>
  );
}

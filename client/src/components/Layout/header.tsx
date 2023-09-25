import { LogIn, Menu, User, ChevronDown, ChevronUp } from "lucide-react";
import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { AuthContext } from "../../contexts/AuthContext";

export default function Header() {
  const { user, isAuthenticated, signOut } = useContext(AuthContext);
  const route = !!user ? `/${user.role}/dashboard` : `/`;

  const [visible, setVisible] = useState(false);
  const menuSize = "8rem";

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
          <button
            style={{
              width: menuSize,
            }}
            onClick={() => setVisible(!visible)}
            className={`w-24 md:w-${menuSize} justify-between border border-gray-300 p-2 rounded-md hover:bg-base-200`}
          >
            {user?.avatarURL ? (
              <Image
                src={user?.avatarURL}
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <User />
            )}
            <span className="truncate">{user?.name}</span>
            <span>{visible ? <ChevronUp /> : <ChevronDown />}</span>
          </button>
        ) : (
          <Link
            className="border-0 btn hover:bg-info-content text-info flex flex-row gap-2"
            href="/login"
          >
            Login <LogIn />
          </Link>
        )}
      </div>
      <div
        style={{
          width: menuSize,
        }}
        className={`${
          visible ? "flex" : "hidden"
        } flex-col gap-2 absolute top-14 right-5 z-50 rounded-md bg-base-100 border border-gray-200 p-2`}
      >
        <Link
          href={`/${user?.role}/profile`}
          className="hover:bg-blue-200 text-primary flex items-center gap-1 rounded-sm h-8 justify-center"
        >
          Ver perfil
        </Link>
        <div className="border border-gray-200"></div>
        <button
          className="hover:bg-error-content text-error flex items-center gap-1 rounded-sm h-8 justify-center"
          onClick={signOut}
        >
          Sair da conta
        </button>
      </div>
    </>
  );
}

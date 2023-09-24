import { LogIn, LogOut, Menu, User } from "lucide-react";
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
        <div className="dropdown dropdown-end w-1/3 max-w-xs">
          <label
            tabIndex={0}
            className="w-full btn btn-ghost border-gray-300 rounded-btn"
          >
            {user?.name}
          </label>
          <ul
            tabIndex={0}
            className="w-full menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box mt-1"
          >
            <li>
              <Link href={`/${user?.role}/profile`}>
                <User />
                Perfil
              </Link>
            </li>
            <li>
              <a
                className="hover:bg-error-content text-error"
                onClick={handleLogout}
              >
                <LogOut />
                Sair
              </a>
            </li>
          </ul>
        </div>
      ) : (
        // <div className="dropdown dropdown-hover">
        //   <label
        //     tabIndex={0}
        //     className="w-40 text-primary text-center font-semibold"
        //   >
        //     <span className="block sm:hidden">
        //       <User />
        //     </span>
        //     <span className="hidden sm:block border border-primary rounded-md p-2">
        //       {user?.name}
        //     </span>
        //   </label>
        //   <ul
        //     tabIndex={0}
        //     className="w-40 bg-base-200 dropdown-content z-[1] p-2 shadow text-primary font-semibold"
        //   >
        //     <li>
        //       <button>
        //         <User />
        //         Perfil
        //       </button>
        //     </li>
        //     <li>
        //       <button
        //         className="flex items-center gap-1 hover:bg-error-content text-error"
        //         onClick={handleLogout}
        //       >
        //         <LogOut />
        //         Sair
        //       </button>
        //     </li>
        //   </ul>
        // </div>
        <Link
          className="border-0 btn hover:bg-info-content text-info flex flex-row gap-2"
          href="/login"
        >
          Login <LogIn />
        </Link>
      )}
    </div>
  );
}

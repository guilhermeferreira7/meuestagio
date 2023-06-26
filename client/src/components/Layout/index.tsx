import React, { ReactNode, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

import StudentMenu from "./menus/student-menu";
import DefaultMenu from "./menus/default-menu";
import CompanyMenu from "./menus/company-menu";
import AdminMenu from "./menus/admin-menu";
import Header from "./header";
import PageMenu from "./page-menu";
import Footer from "./footer";
import { Role } from "../../utils/types/auth/user-auth";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const { user } = useContext(AuthContext);

  let menuItems = DefaultMenu();

  switch (user?.role) {
    case Role.Student:
      menuItems = StudentMenu();
      break;
    case Role.Company:
      menuItems = CompanyMenu();
      break;
    case Role.Admin:
      menuItems = AdminMenu();
      break;
    default:
      menuItems = DefaultMenu();
      break;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <Header />
          <div className="flex flex-1">
            <div className="hidden lg:flex">
              <PageMenu menuItems={menuItems} />
            </div>
            <main className="flex flex-col items-center w-full mt-5">
              {children}
            </main>
          </div>
          <footer className="p-4 justify-center mt-auto border-t-2 border-opacity-10">
            <Footer />
          </footer>
        </div>

        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 h-full bg-base-100">
            {menuItems?.map((item: any, key: any) => (
              <li key={key} className="border-b-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

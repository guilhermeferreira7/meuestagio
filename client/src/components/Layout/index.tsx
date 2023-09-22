import React, { ReactNode, useContext } from "react";

import { AuthContext } from "@contexts/AuthContext";
import { Role } from "@customTypes/auth/user-auth";

import defaultMenu from "./menus/default-menu";
import studentMenu from "./menus/student-menu";
import companyMenu from "./menus/company-menu";
import adminMenu from "./menus/admin-menu";
import Header from "./header";
import PageMenu from "./page-menu";
import Footer from "./footer";
import MenuItem from "./_menu-item";
import { ToastContainer } from "react-toastify";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const { user } = useContext(AuthContext);

  let menuItems: any = defaultMenu;

  switch (user?.role) {
    case Role.Student:
      menuItems = studentMenu;
      break;
    case Role.Company:
      menuItems = companyMenu;
      break;
    case Role.Admin:
      menuItems = adminMenu;
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
            <main className="flex flex-col items-center w-full my-5">
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
              <li
                key={key}
                className="border-b-2 w-full"
                onClick={() => {
                  const drawer = document.getElementById("my-drawer");
                  if (drawer) {
                    drawer.click();
                  }
                }}
              >
                <MenuItem {...item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

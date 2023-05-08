import React, { ReactNode, useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import StudentMenu from "./menus/student-menu";
import DefaultMenu from "./menus/default-menu";
import Footer from "./footer";
import { Role } from "../../utils/types/user-auth";
import Header from "./header";
import CompanyMenu from "./menus/company-menu";

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
    case Role.Professor:
      // menuItems = DefaultMenu();
      break;
    case Role.Admin:
      // menuItems = DefaultMenu();
      break;
    default:
      menuItems = DefaultMenu();
      break;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-base-100 flex flex-row justify-center drop-shadow-lg">
        <Header menuItems={menuItems} />
      </header>
      <main className="text-base-content flex flex-1 justify-center overflow-auto">
        {children}
      </main>
      <footer className="p-4 justify-center mt-auto border-t-2 border-opacity-10">
        <Footer />
      </footer>
    </div>
  );
}

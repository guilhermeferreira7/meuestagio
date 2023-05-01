import Link from "next/link";
import React, { ReactNode, useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import StudentMenu from "./menus/student-menu";
import DefaultMenu from "./menus/default-menu";
import { themeChange } from "theme-change";
import { LogOut } from "lucide-react";
import LayoutHeader from "./header";
import LayoutFooter from "./footer";
import LayoutNavbar from "./navbar";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    themeChange(false);
  }, []);

  let menuItems = DefaultMenu();
  if (user?.role === "student") {
    menuItems = StudentMenu();
  } else {
    menuItems = DefaultMenu();
  }

  return (
    <div className="drawer drawer-mobile">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        <LayoutHeader />
        <main className="flex flex-1 justify-center">
          <div className="flex-1 h-full pt-3">{children}</div>
        </main>
        <LayoutFooter />
      </div>
      <LayoutNavbar menuItems={menuItems} />
    </div>
  );
}

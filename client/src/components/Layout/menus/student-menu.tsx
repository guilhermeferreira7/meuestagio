import React, { useContext } from "react";
import Link from "next/link";
import { Home, User } from "lucide-react";

export default function StudentMenu() {
  const menuItems = [
    <Link className="w-full" href="/">
      <Home />
      Inicio
    </Link>,
    <Link className="w-full" href="/student/profile">
      <User />
      Perfil
    </Link>,
  ];
  return menuItems;
}

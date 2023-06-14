import React from "react";
import Link from "next/link";
import { Home, UserPlus } from "lucide-react";

export default function DefaultMenu() {
  const menuItems = [
    <Link className="w-full" href="/">
      <Home />
      Inicio
    </Link>,
    <Link className="w-full" href="/create-account">
      <UserPlus />
      Criar conta
    </Link>,
  ];
  return menuItems;
}

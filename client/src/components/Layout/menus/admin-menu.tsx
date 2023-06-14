import React from "react";
import Link from "next/link";
import { Home, Plus } from "lucide-react";

export default function AdminMenu() {
  const menuItems = [
    <Link className="w-full" href="/">
      <Home />
      Início
    </Link>,
    <Link className="w-full" href="/admin/register">
      <Plus />
      Cadastrar
    </Link>,
  ];
  return menuItems;
}

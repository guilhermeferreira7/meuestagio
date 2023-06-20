import React from "react";
import Link from "next/link";
import { Home, Plus } from "lucide-react";

export default function AdminMenu() {
  const menuItems = [
    <Link className="w-full flex" href="/">
      <Home className="w-1/6" />
      <span className="w-5/6">Início</span>
    </Link>,
    <Link className="w-full flex" href="/admin/register/cities">
      <Plus className="w-1/6" />
      <span className="w-5/6">Cadastrar cidades</span>
    </Link>,
    <Link className="w-full flex" href="/admin/register/areas">
      <Plus className="w-1/6" />
      <span className="w-5/6">Cadastrar áreas de conhecimento</span>
    </Link>,
    <Link className="w-full flex" href="/admin/register/institutions">
      <Plus className="w-1/6" />
      <span className="w-5/6">Cadastrar instituições</span>
    </Link>,
  ];
  return menuItems;
}

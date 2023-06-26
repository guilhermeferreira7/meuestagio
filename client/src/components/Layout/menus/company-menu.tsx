import React from "react";
import Link from "next/link";
import { Home, ListOrdered, PlusCircle, User } from "lucide-react";

export default function CompanyMenu() {
  const menuItems = [
    <Link className="w-full" href="/">
      <Home />
      Inicio
    </Link>,
    <Link className="w-full" href="/company/profile">
      <User />
      Perfil
    </Link>,
    <Link className="w-full" href="/company/create-vacancy">
      <PlusCircle />
      Cadastrar vaga
    </Link>,
    <Link className="w-full" href="/company/vacancies">
      <ListOrdered />
      Vagas cadastradas
    </Link>,
  ];
  return menuItems;
}

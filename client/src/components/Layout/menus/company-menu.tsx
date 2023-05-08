import React, { useContext } from "react";
import Link from "next/link";
import { HomeOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";
import { PlusCircle } from "lucide-react";

export default function CompanyMenu() {
  const menuItems = [
    <Link className="w-full" href="/">
      <HomeOutlined />
      Inicio
    </Link>,
    <Link className="w-full" href="/company/profile">
      <UserOutlined />
      Perfil
    </Link>,
    <Link className="w-full" href="/company/create-vacancy">
      <PlusCircle />
      Cadastrar vaga
    </Link>,
  ];
  return menuItems;
}

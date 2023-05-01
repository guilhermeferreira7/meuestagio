import React, { useContext } from "react";
import Link from "next/link";
import { HomeOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";

export default function StudentMenu() {
  const menuItems = [
    <Link className="w-full" href="/">
      <HomeOutlined />
      Inicio
    </Link>,
    <Link className="w-full" href="/student/profile">
      <UserOutlined />
      Perfil
    </Link>,
    <Link className="w-full" href="/student/vacancies">
      <SearchOutlined />
      Buscar vagas
    </Link>,
  ];
  return menuItems;
}

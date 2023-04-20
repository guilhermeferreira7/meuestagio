import React, { useContext } from "react";
import Link from "next/link";
import {
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../../src/contexts/AuthContext";

export default function StudentMenu() {
  const { signOut } = useContext(AuthContext);
  const handleLogout = () => {
    signOut();
  };

  const menuItems = [
    {
      label: <Link href="/">Inicio</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: <Link href="/student/profile">Perfil</Link>,
      key: "profile",
      icon: <UserOutlined />,
    },
    {
      label: <Link href="/student/vacancies">Buscar vagas</Link>,
      key: "vacancies",
      icon: <SearchOutlined />,
    },
    {
      label: (
        <Link href="" onClick={handleLogout}>
          Logout
        </Link>
      ),
      key: "login",
      icon: <LogoutOutlined />,
    },
  ];
  return menuItems;
}

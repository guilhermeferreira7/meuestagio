import React from "react";
import Link from "next/link";
import {
  HomeOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

export default function DefaultMenu() {
  const menuItems = [
    {
      label: <Link href="/">Inicio</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: <Link href="/login">Login</Link>,
      key: "login",
      icon: <LoginOutlined />,
    },
    {
      label: <Link href="/create-account">Criar conta</Link>,
      key: "createAccount",
      icon: <UserAddOutlined />,
    },
  ];
  return menuItems;
}

import React from "react";
import Link from "next/link";
import {
  HomeOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

export default function DefaultMenu() {
  const menuItems = [
    <Link className="w-full" href="/">
      <HomeOutlined />
      Inicio
    </Link>,
    <Link className="w-full" href="/create-account">
      <UserAddOutlined />
      Criar conta
    </Link>,
  ];
  return menuItems;
}

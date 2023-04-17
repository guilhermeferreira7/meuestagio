import React, { useContext } from "react";
import Link from "next/link";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { destroyCookie } from "nookies";
import { useRouter } from "next/router";
import { AuthContext } from "../../../src/contexts/AuthContext";

export default function StudentMenu() {
  const router = useRouter();
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

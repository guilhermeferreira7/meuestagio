import React from "react";
import { Home, Plus } from "lucide-react";

const adminMenu = [
  {
    icon: <Home />,
    href: "/",
    label: "Início",
  },
  {
    icon: <Plus />,
    href: "/admin/register/cities",
    label: "Cadastrar cidades",
  },
  {
    icon: <Plus />,
    href: "/admin/register/institutions",
    label: "Cadastrar instituições",
  },
];

export default adminMenu;

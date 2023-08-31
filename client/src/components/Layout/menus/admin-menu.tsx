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
];

export default adminMenu;

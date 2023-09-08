import React from "react";
import { Home, Plus } from "lucide-react";

const adminMenu = [
  {
    icon: <Home />,
    href: "/admin/dashboard",
    label: "Início",
  },
  {
    icon: <Plus />,
    href: "/admin/cities",
    label: "Cadastrar cidades",
  },
  {
    icon: <Plus />,
    href: "/admin/institutions",
    label: "Cadastrar instituições",
  },
  {
    icon: <Plus />,
    href: "/admin/courses",
    label: "Cadastrar cursos",
  },
];

export default adminMenu;

import React from "react";
import Link from "next/link";
import { Home, ListOrdered, PlusCircle, User } from "lucide-react";

const companyMenu = [
  {
    icon: <Home />,
    href: "/",
    label: "Início",
  },
  {
    icon: <User />,
    href: "/company/profile",
    label: "Perfil",
  },
  {
    icon: <PlusCircle />,
    href: "/company/create-vacancy",
    label: "Cadastrar vaga",
  },
  {
    icon: <ListOrdered />,
    href: "/company/vacancies",
    label: "Vagas cadastradas",
  },
];

export default companyMenu;

import React from "react";
import Link from "next/link";
import { Home, ListOrdered, PlusCircle, User } from "lucide-react";

const companyMenu = [
  {
    icon: <ListOrdered />,
    href: "/company/dashboard",
    label: "Vagas cadastradas",
  },
  {
    icon: <PlusCircle />,
    href: "/company/create-job",
    label: "Cadastrar vaga",
  },
];

export default companyMenu;

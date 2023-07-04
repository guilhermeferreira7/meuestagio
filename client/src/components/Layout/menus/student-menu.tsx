import React from "react";
import { Home, User } from "lucide-react";

const studentMenu = [
  {
    icon: <Home />,
    href: "/",
    label: "Início",
  },
  {
    icon: <User />,
    href: "/student/profile",
    label: "Perfil",
  },
];

export default studentMenu;

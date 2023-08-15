import React from "react";
import { Briefcase, Clipboard, Home, User } from "lucide-react";

const studentMenu = [
  {
    icon: <User />,
    href: "/student/profile",
    label: "Perfil",
  },
  {
    icon: <Briefcase />,
    href: "/",
    label: "Vagas",
  },
  {
    icon: <Clipboard />,
    href: "/student/applications",
    label: "Candidaturas",
  },
];

export default studentMenu;

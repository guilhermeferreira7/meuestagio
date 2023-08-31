import React from "react";
import { Briefcase, Clipboard, GraduationCap, Home, User } from "lucide-react";

const studentMenu = [
  {
    icon: <User />,
    href: "/student/profile",
    label: "Dados Pessoais",
  },
  {
    icon: <GraduationCap />,
    href: "/student/resume",
    label: "Currículo",
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

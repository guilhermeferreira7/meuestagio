import React from "react";
import {
  BookDown,
  Briefcase,
  Building,
  Clipboard,
  Crosshair,
  FolderCog,
  GraduationCap,
  Home,
  Languages,
  Scroll,
  User,
} from "lucide-react";

const studentMenu = [
  {
    icon: <User />,
    href: "/student/profile",
    label: "Dados Pessoais",
  },
  {
    icon: <Scroll />,
    subMenu: {
      title: "Dados profissionais",
      menuItems: [
        {
          icon: <BookDown />,
          href: "/student/resume",
          label: "Ver Currículo",
        },
        {
          icon: <GraduationCap />,
          href: "/student/resume/education",
          label: "Formação",
        },
        {
          icon: <Building />,
          href: "/student/resume/experience",
          label: "Experiência",
        },
        {
          icon: <Crosshair />,
          href: "/student/resume/skills",
          label: "Habilidades",
        },
        {
          icon: <FolderCog />,
          href: "/student/resume/projects",
          label: "Projetos",
        },
        {
          icon: <Languages />,
          href: "/student/resume/languages",
          label: "Idiomas",
        },
      ],
    },
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

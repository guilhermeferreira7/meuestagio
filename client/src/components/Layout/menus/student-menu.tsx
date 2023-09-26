import {
  BookDown,
  Briefcase,
  Building,
  Clipboard,
  Crosshair,
  FolderCog,
  GraduationCap,
  Languages,
  Scroll,
  User,
} from "lucide-react";

const studentMenu = [
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
          icon: <Crosshair />,
          href: "/student/resume/skills",
          label: "Habilidades",
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
          icon: <Languages />,
          href: "/student/resume/languages",
          label: "Idiomas",
        },
      ],
    },
  },
  {
    icon: <Briefcase />,
    href: "/student/dashboard",
    label: "Vagas",
  },
  {
    icon: <Clipboard />,
    href: "/student/applications",
    label: "Candidaturas",
  },
];

export default studentMenu;

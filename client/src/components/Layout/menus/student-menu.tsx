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
      title: "Meu Currículo",
      menuItems: [
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
          label: "Experiências",
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
    icon: <Clipboard />,
    href: "/student/applications",
    label: "Minhas Candidaturas",
  },
];

export default studentMenu;

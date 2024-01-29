import {
  Building,
  Clipboard,
  Crosshair,
  GraduationCap,
  Languages,
  Scroll,
} from "lucide-react";

export const studentMenu = [
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

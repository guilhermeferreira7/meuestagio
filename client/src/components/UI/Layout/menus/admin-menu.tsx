import { Add, HomeOutlined } from "@mui/icons-material";

const adminMenu = [
  {
    icon: <HomeOutlined />,
    href: "/admin/dashboard",
    label: "Início",
  },
  {
    icon: <Add />,
    href: "/admin/cities",
    label: "Cadastrar cidades",
  },
  {
    icon: <Add />,
    href: "/admin/institutions",
    label: "Cadastrar instituições",
  },
  {
    icon: <Add />,
    href: "/admin/courses",
    label: "Cadastrar cursos",
  },
  {
    icon: <Add />,
    href: "/admin/professors",
    label: "Cadastrar professores",
  },
];

export default adminMenu;

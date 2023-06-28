import { Home, Shield, UserPlus } from "lucide-react";

const defaultMenu = [
  {
    icon: <Home />,
    href: "/",
    label: "Inicio",
  },
  {
    icon: <UserPlus />,
    href: "/create-account",
    label: "Criar conta",
  },
  {
    icon: <Shield />,
    href: "/login/admin",
    label: "Painel Admin",
  },
];

export default defaultMenu;

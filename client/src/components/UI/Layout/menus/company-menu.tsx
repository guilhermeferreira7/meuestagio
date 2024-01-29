import { Add, GroupOutlined, WorkOutline } from "@mui/icons-material";

export const companyMenu = [
  {
    icon: <WorkOutline />,
    href: "/company/dashboard",
    label: "Vagas cadastradas",
  },
  {
    icon: <Add />,
    href: "/company/create-job",
    label: "Cadastrar vaga",
  },
  {
    icon: <GroupOutlined />,
    href: "/company/candidates",
    label: "Candidatos para entrevista",
  },
];

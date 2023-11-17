import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowBack, Home } from "@mui/icons-material";

type PageDefaultsProps = {
  linksTree?: {
    name: string;
    href: string;
    icon?: React.ReactNode;
  }[];
  currentPage?: string;
};

export default function PageDefaults({
  linksTree,
  currentPage,
}: PageDefaultsProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{currentPage}</title>
      </Head>

      <div className="self-start pl-2">
        <button
          className="text-primary text-sm link-hover"
          onClick={router.back}
        >
          <ArrowBack /> Voltar
        </button>
        <div className="breadcrumbs">
          <ul>
            <li>
              <Link className="text-primary" href="/">
                <Home /> Início
              </Link>
            </li>
            {linksTree?.map((link, index) => (
              <li key={index}>
                <Link className="text-primary gap-1" href={link.href}>
                  {link.icon} {link.name}
                </Link>
              </li>
            ))}
            <li>{currentPage}</li>
          </ul>
        </div>
      </div>
    </>
  );
}

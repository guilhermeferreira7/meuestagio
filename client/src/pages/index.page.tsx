import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { parseCookies } from "nookies";

import { COMPANIES_PATH, JOBS_PATH } from "app-constants";
import { serverApi } from "services";
import { Company, Job } from "types";
import { errorToString } from "utils";

export default function Home() {
  return (
    <>
      <Head>
        <title>MeuEstágio</title>
      </Head>
      <div className="flex flex-col flex-1 items-center w-full my-5">
        <div className="text-center">
          <h1 className="text-sm md:text-xl lg:text-3xl font-semibold p-1">
            <span className="font-bold text-primary">MeuEstagio</span>: a melhor
            plataforma para encontrar estágios ou contratar novos estagiários.
          </h1>
        </div>

        <div className="text-center">
          <h2 className="text-sm md:text-lg lg:text-2xl">
            Mais de 200 empresas cadastradas e cerca de 700 vagas de estágio em
            aberto.
          </h2>
        </div>

        <div className="text-center">
          <h2 className="text-sm md:text-lg lg:text-2xl">
            <Link className="text-info font-semibold" href="/login">
              Entre
            </Link>{" "}
            no sistema agora ou{" "}
            <Link className="text-info font-semibold" href="/create-account">
              crie uma conta
            </Link>{" "}
            para começar a procurar ou a publicar vagas!
          </h2>
        </div>

        <div className="flex flex-col w-4/5 text-center mt-5">
          <h3 className="self-center lg:self-start text-xl font-semibold text-info italic mb-2">
            Empresas contratando
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full"></div>
        </div>
        <div className="flex flex-col w-4/5 text-center mt-5">
          <h3 className="self-center lg:self-start text-xl font-semibold text-info italic mb-2">
            Ultimas vagas cadastradas
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full"></ul>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["meuestagio.token"]: token } = parseCookies(ctx);
  const { ["meuestagio.user"]: user } = parseCookies(ctx);

  const userObj = user ? JSON.parse(user) : null;

  if (token && userObj) {
    return {
      redirect: { destination: `/${userObj.role}/dashboard`, permanent: false },
    };
  }

  try {
    const apiClient = serverApi(ctx);
    const { data: jobs } = await apiClient.get<Job[]>(JOBS_PATH);
    const { data: companies } = await apiClient.get<Company[]>(COMPANIES_PATH);

    return { props: { jobs, companies } };
  } catch (error) {
    console.log(errorToString(error));
    return { props: { jobs: [], companies: [] } };
  }
};

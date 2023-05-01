import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { parseCookies } from "nookies";

import styles from "./styles.module.css";
import { Button, notification, theme } from "antd";
import { useRouter } from "next/router";

export default function StudentDashboard() {
  const router = useRouter();
  useEffect(() => {
    notification["warning"]({
      message: "Aviso!",
      description: "Termine seu cadastro para utilizar o sistema",
      btn: (
        <Button onClick={() => router.push("/student/profile")}>
          Terminar cadastro
        </Button>
      ),
    });
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.pageHeader}>
        <h1>Dashboard</h1>
      </header>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["next.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

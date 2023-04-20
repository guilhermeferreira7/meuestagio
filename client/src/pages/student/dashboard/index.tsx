import { GetServerSideProps } from "next";
import React from "react";
import { parseCookies } from "nookies";

import styles from "./styles.module.css";

export default function StudentDashboard() {
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

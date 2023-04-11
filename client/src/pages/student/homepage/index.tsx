import { GetServerSideProps } from "next";
import React from "react";

export default function StudentHomePage() {
  return <div>Student Home Page</div>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

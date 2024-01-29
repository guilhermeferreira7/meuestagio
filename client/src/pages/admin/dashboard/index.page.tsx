import { GetServerSideProps } from "next";

import { City } from "types";
import { errorToString } from "utils";

interface AdminDashboardProps {
  cities: City[];
}

export default function AdminDashboard({ cities }: AdminDashboardProps) {
  return (
    <>
      <div className="w-11/12 flex justify-center">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    return {
      props: {},
    };
  } catch (error) {
    console.log(errorToString(error));
    return {
      props: {},
    };
  }
};

import { useRouter } from "next/router";
import React from "react";

export default function Vacancy() {
  const router = useRouter();
  const { id } = router.query;
  return <div>Vaga {id}</div>;
}

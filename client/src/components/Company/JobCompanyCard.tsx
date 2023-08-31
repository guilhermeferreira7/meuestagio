import React from "react";
import Link from "next/link";

import { Job } from "../../utils/types/job";
import AppCard from "../AppCard";

interface JobCompanyCardProps {
  job: Job;
}

export default function JobCompanyCard({ job }: JobCompanyCardProps) {
  return (
    <>
      <AppCard>
        <h2 className="flex justify-between text-2xl">
          {job.title} - {job.remote ? "Remoto" : "Presencial"} - Código:{" "}
          {job.id}
        </h2>
        <div className="flex flex-col md:flex-row gap-1 justify-between">
          <div className="flex flex-col items-start text-xl">
            <p>
              Local: {job.city.name} - {job.state}
            </p>
            <p>Palavras chave: {job.keywords}</p>
          </div>
          <Link href={`job/applications/${job.id}`} className="btn btn-primary">
            Ver Candidatos
          </Link>
        </div>
      </AppCard>
    </>
  );
}

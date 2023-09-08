import Link from "next/link";
import React from "react";
import { Briefcase, DollarSign, MapPin } from "lucide-react";

import AppCard from "@components/AppCard";
import { Job } from "@customTypes/job";

interface JobCardStudentProps {
  job: Job;
}

export default function JobCardStudent({ job }: JobCardStudentProps) {
  return (
    <>
      <AppCard>
        <h2 className="flex justify-between items-center">
          <span className="text-primary font-bold text-2xl">{job.title}</span>
          <span className="font-normal text-sm">Código da vaga: {job.id}</span>
        </h2>
        <p className="text-sm">{job.remote ? "(Remoto)" : "(Presencial)"}</p>
        <p className="text-sm">{job.area.title}</p>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-1">
            <div className="line-clamp-1 text-lg flex gap-1 items-center">
              <Briefcase /> {job.company.name}
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <MapPin /> {job.city.name} - {job.state}
          </div>
          <div className="flex gap-1 items-center">
            <DollarSign />{" "}
            {job.salary ? `R$ ${job.salary},00` : "Salário não informado"}
          </div>
          <div className="line-clamp-4">
            <div>{job.description.replace(/<[^>]*>?/gm, " ")}</div>
          </div>
          <div className="card-actions flex flex-row items-center justify-between">
            <ul>
              {job.keywords.split(",").map((keyword, index) => (
                <li
                  key={index}
                  className="inline-block group-hover:bg-white bg-base-200 rounded-full px-3 py-1 text-sm font-semibold mr-2"
                >
                  {keyword}
                </li>
              ))}
            </ul>
          </div>
          <Link
            className="w-full btn btn-sm btn-info md:btn-md"
            href={`job/${job.id}`}
          >
            Ver mais detalhes
          </Link>
        </div>
      </AppCard>
    </>
  );
}

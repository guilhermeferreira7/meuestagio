import Link from "next/link";
import React from "react";
import {
  AttachMoney,
  InfoOutlined,
  MapOutlined,
  SchoolOutlined,
  WorkOutline,
} from "@mui/icons-material";

import { AppCard } from "../../../components";
import { Job } from "../../../types/job";

interface JobCardStudentProps {
  job: Job;
  areaId: number;
}

export default function JobCardStudent({ job, areaId }: JobCardStudentProps) {
  const tooltipText = "Seu curso é compatível com esta vaga!";

  return (
    <>
      <AppCard>
        <h2 className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span
              data-tip={tooltipText}
              className={`font-semibold text-2xl ${
                job.areaId === areaId &&
                "text-primary tooltip tooltip-primary tooltip-top"
              }`}
            >
              {job.title}
            </span>
            <span className="text-sm">
              {job.remote ? "(Remoto)" : "(Presencial)"}
            </span>
          </div>
          <span className="font-normal text-sm">Código da vaga: {job.id}</span>
        </h2>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-1">
            <div className="line-clamp-1 text-lg flex gap-1 items-center">
              <WorkOutline /> {job.company.name}
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <SchoolOutlined /> {job.area.title}
          </div>
          <div className="flex gap-1 items-center">
            <MapOutlined /> {job.city.name} - {job.state}
          </div>
          <div className="flex gap-1 items-center">
            <AttachMoney />{" "}
            {job.salary ? `R$ ${job.salary},00` : "Salário não informado"}
          </div>
          <div className="line-clamp-4">
            <InfoOutlined /> {job.description.replace(/<[^>]*>?/gm, " ")}
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
            href={`job-details/${job.id}`}
          >
            Ver mais detalhes
          </Link>
        </div>
      </AppCard>
    </>
  );
}

import { Building2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function CardVacancy({ vacancy }: any) {
  return (
    <div className="card shadow-sm shadow-primary">
      <div className="card-body">
        <div className="card-title">
          <h2 className="text-primary font-bold">{vacancy.title}</h2>
        </div>
        <div className="flex flex-row gap-1">
          <span>
            <Building2 />
          </span>
          <p className="line-clamp-1 text-lg">{vacancy.company.name}</p>
        </div>
        <p className="line-clamp-3">Descrição: {vacancy.description}</p>
        <p>Salário: R$ {vacancy.salary},00</p>
        <div className="card-actions flex flex-row justify-end">
          <button className="btn btn-sm btn-info md:btn-md">
            <Link href={`vacancy/${vacancy.id}`} target="_blank">
              Ver mais detalhes
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

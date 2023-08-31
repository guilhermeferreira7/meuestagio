import { Building, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function PublicJobCard() {
  return (
    <div className="flex flex-col m-1 card  shadow-sm shadow-primary">
      <div className="font-semibold">
        Vaga de estágio em desenvolvimento de software
      </div>
      <div>Código da vaga: 1297</div>
      <div>Salario: R$2500,00</div>
      <div className="p-1">
        <Link href="/login" className="btn btn-info btn-sm">
          Mais detalhes
        </Link>
      </div>
    </div>
  );
}

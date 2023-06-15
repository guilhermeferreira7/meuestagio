import { Building, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function CompanyCard() {
  return (
    <div className="flex flex-col m-1 card  shadow-sm shadow-primary">
      <div className="flex items-center">
        <div className="m-2">
          <Building className="text-amber-500" />
        </div>
        <div className="font-semibold">Nome da empresa</div>
      </div>
      <div className="self-start ml-2 mb-2 text-left">
        Slogan da empresa, texto muito muito muito grande
      </div>
      <div className="self-start ml-2 mb-2 flex text-info font-semibold">
        <Link className="" href="/login">
          7 vagas em aberto
        </Link>
        <ChevronRight />
      </div>
    </div>
  );
}

import React from "react";
import AppCard from "../../../components/AppCard";
import { Book } from "lucide-react";

export default function Resume() {
  return (
    <>
      <AppCard>
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl flex items-center gap-1">
            <Book />
            Currículo
          </h1>
        </div>
      </AppCard>
    </>
  );
}

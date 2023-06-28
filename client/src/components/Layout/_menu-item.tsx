import { Home } from "lucide-react";
import Link from "next/link";
import React, { ReactNode } from "react";

interface MenuProps {
  icon: ReactNode;
  href: string;
  label: string;
}
export default function MenuItem({ icon, href, label }: MenuProps) {
  return (
    <>
      <Link className="w-full flex" href={href}>
        <span className="w-1/6">{icon}</span>
        <span className="w-5/6">{label}</span>
      </Link>
    </>
  );
}

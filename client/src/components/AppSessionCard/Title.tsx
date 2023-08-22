import Link from "next/link";
import React from "react";

export default function Title({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h2 className="font-semibold text-xl">{children}</h2>
    </>
  );
}

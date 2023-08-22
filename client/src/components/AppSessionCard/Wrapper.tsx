import React, { ReactNode } from "react";

export default function Wrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex flex-col gap-2 mt-2">{children}</div>
    </>
  );
}

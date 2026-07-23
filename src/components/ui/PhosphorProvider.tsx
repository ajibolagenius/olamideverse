"use client";

import { IconContext } from "@phosphor-icons/react";
import type { ReactNode } from "react";

/** Site-wide Phosphor defaults — duotone weight, inherits text color. */
export default function PhosphorProvider({ children }: { children: ReactNode }) {
  return (
    <IconContext.Provider
      value={{
        weight: "duotone",
        size: "1em",
        color: "currentColor",
        mirrored: false,
      }}
    >
      {children}
    </IconContext.Provider>
  );
}

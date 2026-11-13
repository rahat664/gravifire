"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

export default function GameShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add("mission-game-route");
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.classList.remove("mission-game-route");
      document.documentElement.style.overflow = previous;
    };
  }, []);

  return <div className="game-shell">{children}</div>;
}

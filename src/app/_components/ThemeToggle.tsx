"use client";

import * as React from "react";
import { useTheme } from "./ThemeProvider";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "dark";

  const label = mounted
    ? isDark
      ? "Tryb ciemny"
      : "Tryb jasny"
    : "Tryb motywu";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={[
        "glass-switch inline-flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-800 transition hover:brightness-95",
        className,
      ].join(" ")}
      aria-label="Przelacz motyw strony"
      title="Przelacz motyw strony"
    >
      <span
        aria-hidden="true"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs shadow-sm"
      >
        {isDark ? "D" : "L"}
      </span>
      <span>{label}</span>
    </button>
  );
}

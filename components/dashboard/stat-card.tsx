"use client";

import * as React from "react";

interface StatCardProps {
  label: string;
  value: string;
  helper?: string;
  accent?: "primary" | "secondary";
}

export function StatCard({
  label,
  value,
  helper,
  accent = "primary",
}: StatCardProps) {
  const accentClass =
    accent === "secondary" ? "bg-secondary/15 text-secondary" : "bg-primary/10 text-primary";

  return (
    <article className="flex flex-col gap-2 rounded-xl border border-border bg-white/80 p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className={`h-1.5 w-1.5 rounded-full ${accentClass.split(" ")[0]}`}></div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
      {helper && (
        <p className="text-[11px] text-muted-foreground">
          {helper}
        </p>
      )}
    </article>
  );
}


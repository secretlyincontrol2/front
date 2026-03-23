"use client";

import * as React from "react";

interface QuestionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function QuestionCard({
  title,
  description,
  children,
}: QuestionCardProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-white/80 p-4 shadow-sm sm:p-5">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}


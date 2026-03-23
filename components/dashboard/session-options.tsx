"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SessionOptions() {
  const router = useRouter();

  return (
    <section className="grid gap-4 rounded-2xl border border-border bg-white/80 p-4 shadow-sm sm:grid-cols-2 sm:p-5">
      <article className="flex flex-col gap-3 rounded-xl border border-border/60 bg-primary-soft/40 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <BookOpen className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Study session
            </h3>
            <p className="text-xs text-muted-foreground">
              Open uploaded course materials, read at your own pace, and ask the
              chatbot questions for detailed explanations.
            </p>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          className="self-start"
          onClick={() => router.push("/dashboard/study")}
        >
          Enter study session
        </Button>
      </article>

      <article className="flex flex-col gap-3 rounded-xl border border-border/60 bg-secondary/10 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
            <PenTool className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Practice session
            </h3>
            <p className="text-xs text-muted-foreground">
              Attempt topic based questions with an animated character reading
              each question, diagrams, images, and instant feedback.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="self-start"
          onClick={() => router.push("/dashboard/practice")}
        >
          Enter practice session
        </Button>
      </article>
    </section>
  );
}


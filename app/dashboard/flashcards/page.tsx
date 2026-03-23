"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

interface Flashcard {
  id: string;
  source: "missed-question" | "key-note";
  front: string;
  back: string;
}

const mockFlashcards: Flashcard[] = [
  {
    id: "1",
    source: "missed-question",
    front: "Explain the main idea from a question you missed in Topic 1.",
    back: "The key idea is that the system adapts to the student&apos;s pace by breaking content into short visual and text based segments.",
  },
  {
    id: "2",
    source: "key-note",
    front: "Define &quot;visual function&quot; in the context of this tutoring system.",
    back: "Visual functions are diagrams, annotated images, and structured layouts that help the student see how concepts connect.",
  },
  {
    id: "3",
    source: "missed-question",
    front: "What metric is used to track a student&apos;s progress each day",
    back: "Hours spent studying, points earned from practice questions, and goals completed are combined into a simple daily overview.",
  },
];

export default function FlashcardsPage() {
  const [revealed, setRevealed] = React.useState<Record<string, boolean>>({});

  function toggleCard(id: string) {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Flashcards
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            After each practice session, flashcards are created from questions
            you missed and key study materials you read. Use them for quick
            revision and spaced repetition.
          </p>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white/80 p-4 text-xs text-muted-foreground shadow-sm sm:p-5">
          <p>
            The cards below are mocked examples. When the backend is connected,
            they will be generated automatically from your practice history and
            highlighted sections in your notes.
          </p>
          <Button type="button" size="sm" variant="outline">
            Shuffle deck (mock)
          </Button>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {mockFlashcards.map((card) => {
            const isRevealed = revealed[card.id];
            const badgeLabel =
              card.source === "missed-question"
                ? "From a missed question"
                : "From key study material";

            return (
              <article
                key={card.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-white/80 p-4 text-xs shadow-sm"
              >
                <header className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-primary-soft/60 px-2 py-1 text-[10px] font-medium text-primary">
                    {badgeLabel}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Card {card.id}
                  </span>
                </header>
                <p className="min-h-[72px] text-slate-900">
                  {isRevealed ? card.back : card.front}
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => toggleCard(card.id)}
                >
                  {isRevealed ? "Hide answer" : "Reveal answer"}
                </Button>
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}


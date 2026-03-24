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

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = React.useState<Flashcard[]>([]);
  const [revealed, setRevealed] = React.useState<Record<string, boolean>>({});

  function toggleCard(id: string) {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function shuffleDeck() {
    setFlashcards(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setRevealed({});
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

        {flashcards.length === 0 ? (
          <section className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-white/80 p-12 shadow-sm text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft/60">
              <span className="text-3xl">📇</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">No flashcards yet</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Flashcards are automatically generated from questions you miss during practice sessions
                and key concepts from your study materials.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => window.location.href = "/dashboard/practice"}
            >
              Start a practice session
            </Button>
          </section>
        ) : (
          <>
            <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white/80 p-4 text-xs text-muted-foreground shadow-sm sm:p-5">
              <p>{flashcards.length} flashcard{flashcards.length !== 1 ? "s" : ""} in your deck.</p>
              <Button type="button" size="sm" variant="outline" onClick={shuffleDeck}>
                Shuffle deck
              </Button>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              {flashcards.map((card) => {
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
          </>
        )}
      </div>
    </AppShell>
  );
}

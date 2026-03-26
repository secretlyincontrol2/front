"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { getFlashcards, type Flashcard } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import { RefreshCw, Play } from "lucide-react";
import { useCourseSelection } from "@/lib/hooks/use-course-selection";

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = React.useState<Flashcard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [revealed, setRevealed] = React.useState<Record<string, boolean>>({});
  const { selection } = useCourseSelection();

  React.useEffect(() => {
    async function loadCards() {
      try {
        const data = await getFlashcards();
        setFlashcards(data || []);
      } catch (error) {
        console.error("Failed to load flashcards:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, []);

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
      <div className="flex w-full flex-col gap-6 max-w-5xl mx-auto">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Knowledge Deck
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              Master your {selection?.course || "current"} topics through active recall and spaced repetition.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-2" onClick={shuffleDeck}>
              <RefreshCw className="h-4 w-4" />
              Shuffle
            </Button>
            <Button size="sm" className="h-9 gap-2">
              <Play className="h-4 w-4" />
              Study Now
            </Button>
          </div>
        </section>

        {loading ? (
             <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-white/40">
                <RefreshCw className="h-8 w-8 animate-spin text-primary/40" />
                <p className="text-sm font-medium text-muted-foreground">Syncing your deck...</p>
             </div>
        ) : flashcards.length === 0 ? (
          <section className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-white p-12 shadow-sm text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-soft/50 text-primary">
              <RefreshCw className="h-10 w-10 opacity-40" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Your deck is empty</h2>
              <p className="max-w-md mx-auto text-sm text-muted-foreground">
                Start a <span className="text-primary font-medium">Practice Session</span> or upload notes to generate your first set of flashcards.
              </p>
            </div>
            <Button
              className="px-8"
              onClick={() => window.location.href = "/dashboard/practice"}
            >
              Start Practice
            </Button>
          </section>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {flashcards.map((card) => {
              const isRevealed = revealed[card._id];
              
              return (
                <article
                  key={card._id}
                  className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
                >
                  <header className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-lg bg-secondary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {card.topic}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground/60">
                      LV {card.difficulty === 'hard' ? '3' : card.difficulty === 'medium' ? '2' : '1'}
                    </span>
                  </header>
                  
                  <div className="flex-1 space-y-3 prose prose-sm max-w-none text-slate-800 font-medium">
                     <ReactMarkdown>
                        {isRevealed ? card.answer : card.question}
                     </ReactMarkdown>
                  </div>

                  <footer className="mt-5 pt-4 border-t border-slate-50">
                    <Button
                      type="button"
                      size="sm"
                      variant={isRevealed ? "ghost" : "outline"}
                      className={`w-full h-9 rounded-xl text-xs font-bold transition-all ${isRevealed ? 'text-muted-foreground' : 'text-primary border-primary/10 bg-primary-soft/30 hover:bg-primary hover:text-white'}`}
                      onClick={() => toggleCard(card._id)}
                    >
                      {isRevealed ? "Hide Answer" : "Reveal Answer"}
                    </Button>
                  </footer>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </AppShell>
  );
}

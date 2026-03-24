"use client";

import { AppShell } from "@/components/layout/app-shell";
import { CourseSelector } from "@/components/dashboard/course-selector";
import { Button } from "@/components/ui/button";

// Updated: Mock data removed. In production, topics will be fetched based on course selection.
const topics: any[] = [];

const questionPlaceholder = "Select a topic and course to begin your practice session. The animated character will read questions out loud once loaded.";

export default function PracticePage() {
  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Practice session
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Choose your course and topic, then attempt questions that are read
            out by an animated character. Visual diagrams, images, and feedback
            help you focus on one concept at a time.
          </p>
        </section>

        <CourseSelector />

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)]">
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white/80 p-4 shadow-sm sm:p-5">
            <header className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                  Topics for this practice
                </h2>
                <p className="text-xs text-muted-foreground">
                  Practice is broken down into topics so you can stay focused.
                </p>
              </div>
              <span className="rounded-full bg-primary-soft/80 px-2 py-1 text-[11px] font-medium text-primary">
                Topic based
              </span>
            </header>

            <ul className="flex flex-col gap-2 text-xs">
              {topics.length > 0 ? (
                topics.map((topic, index) => (
                  <li
                    key={topic.id}
                    className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 ${
                      index === 0
                        ? "border-primary bg-primary-soft/40"
                        : "border-border bg-white hover:border-primary/60 hover:bg-primary-soft/20"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-slate-900">{topic.label}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {topic.questions} questions &bull; animated character + diagrams
                      </p>
                    </div>
                    <Button type="button" size="sm" variant="outline">
                      {index === 0 ? "In progress" : "Start"}
                    </Button>
                  </li>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <p>No practice topics available for this course.</p>
                  <p className="text-[10px]">Select a different course above or check back later.</p>
                </div>
              )}
            </ul>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white/80 p-4 shadow-sm sm:p-5">
            <header className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                  Question player
                </h2>
                <p className="text-xs text-muted-foreground">
                  An animated character will read each question. You will see
                  diagrams or images here while listening.
                </p>
              </div>
              <span className="rounded-full bg-secondary/20 px-2 py-1 text-[11px] font-medium text-secondary">
                Audio + visual feedback
              </span>
            </header>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]">
              <article className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/70 p-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary shadow-sm">
                    <span className="h-5 w-5 rounded-full border border-primary border-t-transparent" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Animated study guide (placeholder)
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      In the real app, this character moves and speaks the
                      question out loud.
                    </p>
                  </div>
                </div>

                <p className="rounded-xl bg-white p-3 text-slate-900 shadow-sm">
                  {questionPlaceholder}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" size="sm">
                    Play question audio
                  </Button>
                  <Button type="button" size="sm" variant="outline">
                    Replay
                  </Button>
                </div>
              </article>

              <article className="flex flex-col gap-2 rounded-xl border border-border/70 bg-white p-3 text-xs">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Diagram / image area
                </p>
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/70">
                  <span className="max-w-[14rem] text-center text-[11px] text-muted-foreground">
                    When diagrams or images are attached to a question, they
                    will appear here during the animated explanation.
                  </span>
                </div>
              </article>
            </div>

            <section className="mt-2 flex flex-col gap-3 rounded-xl bg-muted/70 p-3 text-xs">
              <p className="text-[11px] font-medium text-slate-900">
                Choose your answer
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {["Option A", "Option B", "Option C", "Option D"].map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      className="rounded-full border border-border bg-white px-3 py-2 text-left text-[11px] font-medium text-slate-900 hover:border-primary/70 hover:bg-primary-soft/40"
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" size="sm" disabled>
                  Submit answer
                </Button>
                <Button type="button" size="sm" variant="outline">
                  Next question
                </Button>
              </div>
            </section>
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-border bg-white/80 p-4 text-xs text-muted-foreground shadow-sm sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)] sm:p-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Today&apos;s practice summary
            </h2>
            <p className="mt-1">
              Select a topic to begin practicing and earning points.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Share your practice achievement
            </h3>
            <p>
              A share card will highlight how many questions you attempted, your
              score, and the topics you focused on for the day.
            </p>
            <Button type="button" size="sm" variant="outline" disabled>
              Share achievement
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}


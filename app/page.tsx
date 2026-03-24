import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <AppShell showAuthCta={true}>
      <div className="grid w-full gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] md:items-center">
        <section className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-soft bg-primary-soft/60 px-3 py-1 text-xs font-medium text-primary shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            AI Powered Tutoring System
          </span>
          <div className="space-y-3">
            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Visual, audio, and practice sessions built around how you study.
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              VisionTutor uses visual functions and AI to personalise study and
              practice sessions, track your progress, and turn your daily
              reading into achievable goals with rewards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/register">
              <Button size="lg">Get started with your school email</Button>
            </Link>
          </div>

          <dl className="grid gap-4 pt-4 text-sm sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-white/70 p-3">
              <dt className="text-xs font-medium text-muted-foreground">
                Study &amp; practice modes
              </dt>
              <dd className="mt-1 text-base font-semibold text-slate-900">
                Guided sessions
              </dd>
            </div>
            <div className="rounded-xl border border-border bg-white/70 p-3">
              <dt className="text-xs font-medium text-muted-foreground">
                Progress tracking
              </dt>
              <dd className="mt-1 text-base font-semibold text-slate-900">
                Hours, points, goals
              </dd>
            </div>
            <div className="rounded-xl border border-border bg-white/70 p-3">
              <dt className="text-xs font-medium text-muted-foreground">
                Visual learning
              </dt>
              <dd className="mt-1 text-base font-semibold text-slate-900">
                Diagrams &amp; flashcards
              </dd>
            </div>
          </dl>
        </section>

        <section className="flex flex-col items-center justify-center rounded-2xl border border-border bg-primary-soft/60 px-3 py-1 shadow-sm backdrop-blur-sm sm:p-5">
          <div className="relative aspect-square w-full max-w-[350px] overflow-hidden rounded-xl">
            <Image
              src="/owl-tutor.png"
              alt="Owl Tutor"
              fill
              className="object-contain"
              priority
            />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

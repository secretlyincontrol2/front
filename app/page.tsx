import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <AppShell showAuthCta>
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
            <Button size="lg">Get started with your school email</Button>
            <p className="text-xs text-muted-foreground">
              No backend yet &mdash; this is a fully interactive UI mock.
            </p>
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

        <section className="flex flex-col gap-3 rounded-2xl border border-border bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
          <h2 className="text-sm font-semibold tracking-tight text-slate-900">
            What you will be able to do
          </h2>
          <ul className="space-y-2 text-xs text-muted-foreground sm:text-sm">
            <li>
              &bull; Create an account with your full name, matric number, and
              school email.
            </li>
            <li>
              &bull; Answer onboarding questions so the chatbot understands your
              gender, age, and preferred mode of study.
            </li>
            <li>
              &bull; Choose your department and course, then enter study or
              practice sessions.
            </li>
            <li>
              &bull; Practice with questions read out by an animated character,
              including diagrams and images.
            </li>
            <li>
              &bull; Generate flashcards from missed questions and key concepts,
              track your points on a leadership board, and share your
              achievements.
            </li>
          </ul>
        </section>
      </div>
    </AppShell>
  );
}

import { AppShell } from "@/components/layout/app-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6 md:flex-row md:items-start">
        <section className="flex-1 space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Create your VisionTutor account
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Start building a personalised study plan with AI powered tutoring,
            practice sessions, flashcards, and a leadership board that tracks
            your progress.
          </p>
        </section>
        <section className="w-full max-w-md">
          <RegisterForm />
        </section>
      </div>
    </AppShell>
  );
}


import { AppShell } from "@/components/layout/app-shell";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default function OnboardingPage() {
  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Personalise your tutoring experience
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Answer a few quick questions about your reading habit so the system
            can adapt study and practice sessions to your pace and preferred
            content type.
          </p>
        </section>
        <OnboardingForm />
      </div>
    </AppShell>
  );
}

